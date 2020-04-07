import React, { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import vtkXMLPolyDataReader from 'vtk.js/Sources/IO/XML/XMLPolyDataReader';
import { BufferGeometry } from 'three';
import { useUpdate } from 'react-three-fiber';

const VtpLoader = ({ fileURL, onLoadTime }) => {
  const [bufferObject, setBufferObject] = useState({});
  const loadStartTime = useRef();

  useEffect(() => {
    loadStartTime.current = performance.now();
    let binary;
    const fetchData = async () => {
      try {
        const resp = await fetch(fileURL);
        binary = await resp.arrayBuffer();
        const vtpReader = vtkXMLPolyDataReader.newInstance();
        try {
          const parsed = vtpReader.parseAsArrayBuffer(binary);
          if (!parsed) {
            throw Error('parse error');
          }
        } catch (e) {
          // setLoading(false);
          // setError('invalid');
          return;
        }

        const source = vtpReader.getOutputData(0);
        // debug(`creating geometry...`);

        const vertices = source.getPoints().getData();
        const normals = source
          .getPointData()
          .getNormals()
          .getData();
        const labels = source
          .getPointData()
          .getArrayByName('Labels')
          .getData();

        const tris = source.getPolys().getData();
        const indices = new Uint32Array(
          source.getPolys().getNumberOfCells() * 3
        );

        let i = 0,
          j = 0;
        while (j < indices.length) {
          indices[j++] = tris[++i];
          indices[j++] = tris[++i];
          indices[j++] = tris[++i];
          ++i;
        }

        const colors = new Float32Array(labels.length * 3);
        setBufferObject({
          vertices,
          normals,
          labels,
          tris,
          indices,
          colors
        });
        source.delete();
      } catch (e) {
        // setLoading(false);
        // setError('network');
        return;
      }
    };
    fetchData();
  }, []);

  const geoRef = useUpdate(
    geometry => {
      if (Object.values(bufferObject).length > 0) {
        const { vertices, normals, indices } = bufferObject;
        geometry.setAttribute(
          'position',
          new THREE.BufferAttribute(vertices, 3)
        );
        geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
        geometry.setIndex(new THREE.BufferAttribute(indices, 1));
        geometry.attributes.position.needsUpdate = true;
        geometry.attributes.normal.needsUpdate = true;
        geometry.index.needsUpdate = true;
        geometry.center();
        geometry.computeBoundingSphere();
        const time = (performance.now() - loadStartTime.current).toFixed(2);
        onLoadTime(time);
      }
    },
    [bufferObject]
  );
  return <bufferGeometry attach="geometry" ref={geoRef} />;
};

export default VtpLoader;
