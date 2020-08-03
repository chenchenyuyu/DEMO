import React from 'react';
import * as THREE from 'three';
import { useEffect, useRef, useReducer } from 'react';
import { useUpdate } from 'react-three-fiber';
import vtkXMLPolyDataReader from 'vtk.js/Sources/IO/XML/XMLPolyDataReader';

import { useAsyncEffect } from '../hooks/effect';

const VtpLoader = ({ src, onLoad, onError }) => {
  const paramsRef = useRef(null);
  const [updateId, invalidate] = useReducer((a) => a + 1, 0);

  // 1. fetch geometry, save geo params
  useAsyncEffect(async(controller) => {
    let binary;
    // fetch src data
    try {
      const resp = await fetch(src);
      binary = resp.arrayBuffer();
    } catch(e) {
      console.error('error', e);
      return onError(e);
    }

    if (controller.aborted) {
      console.error('aborted');
      return onError(new Error('aborted'));
    }
    // parser binary
    const vtpReader = vtkXMLPolyDataReader.newInstance();
    try {
      const parsed = vtpReader.parseAsArrayBuffer(binary);
      if (!parsed) {
        throw Error('parse error');
      }
    } catch(e) {
      console.error('error', e);
      return onError(e);
    }
    // get geometry data
    const source = vtpReader.getOutputData(0);

    const vertices = source.getPoints().getData();

    let normals = null;

    if (source.getPointData().getNormals()) {
      normals = source.getPointData().getNormals().getData();
    }

    let labels = null;

    if (source.getPointData().getArrayByName('Labels')) {
      labels = source.getPointData().getArrayByName('Labels').getData();
    }

    const tris = source.getPolys().getData();
    const indices = new Uint32Array(source.getPolys().getNumberOfCells() * 3);

    let i = 0, j = 0;
    while (j < indices.length) {
      indices[j++] = tris[++i];
      indices[j++] = tris[++i];
      indices[j++] = tris[++i];
      ++i;
    }

    paramsRef.current = { vertices, normals, labels, indices };
    // enforce update
    invalidate();
  }, [src, onLoad, onError]);

  // 2. update geometry
  const ref = useUpdate((geometry) => {
    if (paramsRef.current) {
      const { vertices, normals, labels, indices } = paramsRef.current;
      geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
      geometry.setIndex(new THREE.BufferAttribute(indices, 1));
      geometry.index.needsUpdate = true;
      geometry.attributes.position.needsUpdate = true;
      if (normals) {
        geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
        geometry.attributes.normal.needsUpdate = true;
      } else {
        geometry.computeVertexNormals();
      }
      geometry.computeBoundingSphere();
      return onLoad(geometry);
    }
  }, [updateId]);

  return(
    <bufferGeometry ref={ref} attach="geometry" />
  );
};

export default VtpLoader;
