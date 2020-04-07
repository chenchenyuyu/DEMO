import React, { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Canvas, extend, useThree, useFrame } from 'react-three-fiber';

import './index.css';

extend({ TrackballControls });

const Secne = ({ setLoadTime }) => {
  const controls = useRef();
  const { camera, scene, gl } = useThree();
  useFrame(state => controls.current.update());

  useEffect(() => {
    const loadStartTime = performance.now();
    // gltfLoader loader gltf
    const gltf = new GLTFLoader().load(
      'http://192.168.111.20:8080/sample-1.gltf',
      gltf => {
        gltf.scene.traverse(function(node) {
          if (node instanceof THREE.Mesh) {
            const newMaterial = new THREE.MeshPhongMaterial({
              specular: 0x111111,
              shininess: 50
            });
            node.castShadow = true;
            node.material.side = THREE.DoubleSide;
            node.material = newMaterial;
            node.geometry.center();
            node.geometry.computeBoundingSphere();
          }
          console.log('node', node);
        });
        gltf.scene.scale.set(0.5, 0.5, 0.5);
        console.log('gltf', gltf);
        scene.add(gltf.scene);
        const time = (performance.now() - loadStartTime).toFixed(2);
        setLoadTime(time);
        console.info('Load time: ' + time + ' ms.');
      }
    );
  }, []);
  return (
    <>
      <trackballControls args={[camera, gl.domElement]} ref={controls} />
      <ambientLight color="0xffffff" intensity={0.1} />
      <hemisphereLight
        groundColor="0x080820"
        skyColor="#f0e68c"
        intensity={0.5}
      />
      <directionalLight color="0xf0f0f0" intensity={0.1} />
    </>
  );
};

const Vr = () => {
  const [loadTime, setLoadTime] = useState(0);
  return (
    <div
      className="demo"
      style={{
        background: '#000',
        position: 'relative',
        height: '100vh',
        width: '100%'
      }}
    >
      <div style={{ position: 'absolute', top: '20px', left: '20px' }}>
        gltf load time: {loadTime}ms
      </div>
      <div style={{ textAlign: 'center', fontSize: '24px', color: '#fff' }}>
        《gltf demo》
      </div>
      <Canvas
        camera={{ position: [0, 0, 300], near: 0.1, far: 1e7 }}
        pixelRatio={window.devicePixelRatio}
      >
        <Secne setLoadTime={loadTime => setLoadTime(loadTime)} />
      </Canvas>
    </div>
  );
};

export default Vr;
