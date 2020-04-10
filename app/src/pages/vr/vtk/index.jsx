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

import './index.less';

extend(TrackballControls);

const model = {
  0: 'images/1514056347-T125/04.vtk',
  1: 'images/1514056347-T125/05.vtk',
  2: 'images/1514056347-T125/06.vtk',
  3: 'images/1514056347-T125/09.vtk',
  4: 'images/1514056347-T125/10.vtk',
  5: 'images/1514056347-T125/12.vtk',
  6: 'images/1514056347-T125/13.vtk',
  7: 'images/1514056347-T125/14.vtk',
  8: 'images/1514056347-T125/15.vtk',
  9: 'images/1514056347-T125/16.vtk',
  10: 'images/1514056347-T125/17.vtk',
  11: 'images/1514056347-T125/21.vtk',
  12: 'images/1514056347-T125/22.vtk',
  13: 'images/1514056347-T125/24.vtk',
  14: 'images/1514056347-T125/25.vtk',
  15: 'images/1514056347-T125/27.vtk',
  16: 'images/1514056347-T125/28.vtk',
  17: 'images/1514056347-T125/29.vtk',
  18: 'images/1514056347-T125/30.vtk',
  19: 'images/1514056347-T125/31.vtk',
  20: 'images/1514056347-T125/40.vtk'
};

const VtkLoader = ({ url }) => {
  const vtk = useLoader(VTKLoader, url);
  useMemo(() => {
    vtk.computeVertexNormals();
    vtk.translate(0, 0, 0);
  }, [vtk]);
  return (
    <mesh geometry={vtk}>
      {/* <bufferGeometry attach="geometry"/> */}
      <meshPhongMaterial
        attach="material"
        color={new THREE.Color(Math.random() * 0xffffff)}
        attach="material"
        transparent={false}
        opacity={0.5}
        // depthWrite={false}
        // depthTest={false}
        // flatShading={false}
        // polygonOffsetFactor={0.75}
        // polygonOffsetUnits={4.0}
      />
    </mesh>
  );
};

const Scene = ({ model }) => {
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
        position={[
          -191.36083055745286,
          -195.26194966636896,
          -159.30930405085903
        ]}
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
        <Scene model={model} />
      </Canvas>
    </div>
  );
};

export default Vtk;
