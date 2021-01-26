import React, { useRef, useMemo, Suspense, useState, useEffect } from 'react';
import {
  Canvas,
  useFrame,
  extend,
  useThree,
  useLoader
} from 'react-three-fiber';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import * as THREE from 'three';

// import './index.less';

extend(TrackballControls);

const VtkLoader = ({ url }) => {
 const { scene, camera, gl } = useThree();
  const obj = new OBJLoader().load(url,
   gltf => {
     gltf.traverse(function(node) {
       if (node instanceof THREE.Mesh) {
         const newMaterial = new THREE.MeshPhongMaterial({
           specular: 0x111111,
           shininess: 50,
           color: Math.random() * 0xffffff
         });
         node.castShadow = true;
         node.material.side = THREE.DoubleSide;
         node.material.opacity= 0.5;
         node.transparent = true;
         node.material = newMaterial;
         // node.geometry.center();
         node.geometry.computeVertexNormals( true );
         // node.geometry.computeBoundingSphere();
       }
       console.log('node', node);
     });
     // gltf.scene.scale.set(0.5, 0.5, 0.5);
     console.log('gltf', gltf);
     scene.add(gltf);
   }
 );
  console.log('obj', obj)
  // useMemo(() => {
  //   obj.computeVertexNormals(); // 光滑数据
  //   obj.translate(0, 0, 0);
  // }, [obj]);
  return (
    <mesh geometry={obj}>
      {/* <bufferGeometry attach="geometry"/> */}
      <meshPhongMaterial
        attach="material"
        color={new THREE.Color(Math.random() * 0xffffff)}
        transparent={true}
        opacity={0.6}
        depthWrite={false}
        // depthTest={false}
        // flatShading={false}
        // polygonOffsetFactor={0.75}
        // polygonOffsetUnits={4.0}
      />
    </mesh>
  );
};

const modelObj = {
 0: 'vr/leftLungLowerLobe.obj',
 2: 'vr/leftLungUpperLobe.obj',
 1: 'vr/rightLungLowerLobe.obj',
 3: 'vr/rightLungMiddleLobe.obj',
 4: 'vr/rightLungUpperLobe.obj',
 5:'vr/1864vein.obj',
 6: 'vr/1864airway.obj',
 7: 'vr/1864artery.obj',
};

const Scene = ({ model, position }) => {
  const paramRef = useRef();
  useMemo(() => {
    if (Object.values(model).length > 0) {
      paramRef.current = Object.values(model).map(
        suffix => `http://192.168.3.50:8080/${suffix}`
      );
    }
  }, [model]);
  return (
    <>
      <Controls />
      <Lights />
      <group
        position={position}
      >
        <Suspense fallback={null}>
          {paramRef.current.map(url => (
            <VtkLoader url={url} key={url}/>
          ))}
        </Suspense>
      </group>
    </>
  );
};

const Controls = () => {
  // controls
  const controls = useRef();
  const { scene, camera, gl } = useThree();
  // const { scene } = useThree();
  useEffect(() => {
   const axesHelper = new THREE.AxesHelper( 500 );
   scene.add( axesHelper );
  }, []);
  useFrame(() => controls.current.update());
  return <trackballControls args={[camera, gl.domElement]} ref={controls} />;
};

const Lights = () => {
  return (
    <group>
      <ambientLight intensity={0.3} />
      <pointLight intensity={0.8} position={[-500, -500, 500]} />
      <pointLight intensity={0.5} position={[500, 500, -500]} />
    </group>
  );
};

const Vtk = () => {
  return (
    <div style={{ height: '100vh', width: '100%' }}>
     
      <Canvas
        className="canvas-element"
        orthographic={true}
        camera={{
          zoom: 1,
          position: [
            0,
            0,
            200
          ],
          near: -100,
          far: 3000
        }}
        gl={{ preserveDrawingBuffer: true }}
      >
        <Scene
          model={modelObj}
          position={[
          100,
          100,
          -300
        ]}
        />
      </Canvas>
    </div>
  );
};

export default Vtk;
