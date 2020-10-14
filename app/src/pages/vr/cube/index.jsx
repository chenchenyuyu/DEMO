import React from 'react';
import { Canvas } from 'react-three-fiber';
import { OrbitControls, OrthographicCamera, useCamera } from 'drei';

import './index.less';

const viewCube = () => {
  return(
    <div>
      viewcube
    </div>
  )
};

const Cube = () => {
  return(
    <div className="cube" style={{height: '100vh'}}>
      <Canvas colorManagement>
      <mesh>
        <torusBufferGeometry attach="geometry" args={[1, 0.5, 32, 100]} />
        <meshNormalMaterial attach="material" />
      </mesh>
      <OrbitControls screenSpacePanning />
      </Canvas>
    </div>
  )
};

export default Cube;
