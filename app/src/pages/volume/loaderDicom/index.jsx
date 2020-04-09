import React, { useRef } from 'react';
import { Canvas, extend, useThree, useFrame } from 'react-three-fiber';
import * as THREE from 'three';

import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';

extend(TrackballControls);

const Scene = () => {
  // const [gl, camera] = useThree();
  // const controls = useRef();
  // useFrame(state => controls.current.update());
  return (
    <>
      {/* <trackballControls args={[camera, gl.domElement]} ref={controls} /> */}
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
    </>
  );
};

const LoaderDicom = () => {
  return (
    <div id="r3d" style={{ height: '100vh', width: '100%' }}>
      <Canvas camera={{ position: [0, 0, 300], near: 0.1, far: 1e5 }}>
        <Scene />
      </Canvas>
    </div>
  );
};
export default LoaderDicom;
