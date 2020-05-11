import React, { useRef, useMemo, Suspense } from 'react';
import {
  Canvas,
  useFrame,
  extend,
  useThree,
  useLoader
} from 'react-three-fiber';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import { VTKLoader } from 'three/examples/jsm/loaders/VTKLoader';
import * as THREE from 'three';

import { lsdsModel, tracheaModel } from './model';

import './index.less';

extend(TrackballControls);

const VtkLoader = ({ url }) => {
  const vtk = useLoader(VTKLoader, url);
  useMemo(() => {
    vtk.computeVertexNormals(); // 光滑数据
    vtk.translate(0, 0, 0);
  }, [vtk]);
  return (
    <mesh geometry={vtk}>
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

const Scene = ({ model, position }) => {
  const paramRef = useRef();
  useMemo(() => {
    if (Object.values(model).length > 0) {
      paramRef.current = Object.values(model).map(
        suffix => `http://192.168.111.20:8080/${suffix}`
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
            <VtkLoader url={url} key={url} />
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
        orthographic={true}
        camera={{
          zoom: 1,
          position: [
            -191.36083055745286,
            -195.26194966636896,
            159.30930405085903
          ],
          near: -100,
          far: 3000
        }}
        gl={{ preserveDrawingBuffer: true }}
      >
        <Scene model={lsdsModel} position={[
          -150.36083055745286,
          -120.26194966636896,
          -148.30930405085903
        ]}/>
        <Scene model={tracheaModel} position={[
          -191.36083055745286,
          -195.26194966636896,
          -159.30930405085903
        ]}/>
      </Canvas>
    </div>
  );
};

export default Vtk;
