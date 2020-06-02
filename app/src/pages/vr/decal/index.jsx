import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Canvas, extend, useThree, useFrame, useUpdate } from 'react-three-fiber';

extend({ TrackballControls });

const Scene = ({ fileUrl }) => {
  const controls = useRef();
  const { camera, scene, gl } = useThree();
  useFrame(state => controls.current.update());
  const textureLoader = new THREE.TextureLoader();
	// const decalDiffuse = textureLoader.load('textures/decal/decal-diffuse.png');
  // const decalNormal = textureLoader.load('textures/decal/decal-normal.jpg');
  
const LineGeometry = () => {
  const ref = useUpdate((geometry) => {
    geometry.setFromPoints([new THREE.Vector3(), new THREE.Vector3() ]);
  });
  return (
    <line>
      <bufferGeometry attach="geometry" ref={ref}>
        <lineBasicMaterial color="0xffffff" linewidth={1} linewidth="round"/>
      </bufferGeometry>
    </line>
  );
};

  useEffect(() => {
    const gltf = new GLTFLoader().load(
      // resource URL
      fileUrl,
      // called when the resource is loaded
      gltf => {
        gltf.scene.traverse(function(node) {
          if (node instanceof THREE.Mesh) {
            node.material = new THREE.MeshPhongMaterial({
              specular: 0x111111,
              // map: textureLoader.load('models/decal/Map-COL.jpg'),
              // specularMap: textureLoader.load('models/decal/Map-SPEC.jpg'),
              // normalMap: textureLoader.load('models/decal/Infinite-Level_02_Tangent_SmoothUV.jpg'),
              shininess: 25
            });
            node.castShadow = true;
            node.geometry.center();
            node.geometry.computeBoundingSphere();
          }
          console.log('node', node);
        });
        const mouseHelper = new THREE.Mesh( new THREE.BoxBufferGeometry( 1, 1, 50 ), new THREE.MeshNormalMaterial() );
				mouseHelper.visible = true;
        scene.add(gltf.scene);
				scene.add(mouseHelper);
        console.log('mouseHelper', mouseHelper)
        gltf.scene.scale.set(10, 10, 10);
        console.log('gltf', gltf);
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
    <ambientLight color="0x443333" intensity={0.1} />
    <directionalLight color="0xffddcc" intensity={1} position={[1, 0.75, 0.5]}/>
    <directionalLight color="0xccccff" intensity={1} position={[- 1, 0.75, - 0.5]}/>
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
      <Canvas 
        camera={{ position: [0, 0, 120], fov: 45, aspect: window.innerWidth / window.innerHeight, near: 0.1, far: 1e5 }} lookAt={[0,0,0]} pixelRatio={window.devicePixelRatio}

        >
        <Scene fileUrl="http://192.168.111.20:8080/decal/LeePerrySmith.glb" />
      </Canvas>
    </div>

  )
};

export default Decal;