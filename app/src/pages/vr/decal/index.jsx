import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Canvas, extend, useThree, useFrame } from 'react-three-fiber';

extend({ TrackballControls });

const Scene = ({ fileUrl }) => {
  const controls = useRef();
  const { camera, scene, gl } = useThree();
  useFrame(state => controls.current.update());
  useEffect(() => {
    const gltf = new GLTFLoader().load(
      // resource URL
      fileUrl,
      // called when the resource is loaded
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
      },
      // called when the resource is loaded
      xhr => {
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
      },
      // called when loading has errors
      error => {
        console.log( 'An error happened', error);
      }
    );
  }, []);
  return(
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

const Decal = () => {
  return(
    <div 
      style={{
      background: '#000',
      position: 'relative',
      height: '100vh',
      width: '100%'
    }}>
        <div style={{ textAlign: 'center', fontSize: '24px', color: '#fff' }}>
        《decal demo》
      </div>
      <Canvas camera={{ near: 0.1, far: 1e7 }}>
        <Scene fileUrl="http://192.168.111.20:8080/decal/LeePerrySmith.glb" />
      </Canvas>
    </div>

  )
};

export default Decal;