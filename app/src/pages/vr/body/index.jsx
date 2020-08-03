import React, { useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Canvas, useFrame, useThree, extend } from 'react-three-fiber';

import VtpLoader from '../../../loader/vtpLoader';
import { colorMap } from './colorMap';
import { modelUrls } from './model';

import './index.less';

extend({ OrbitControls });

const VtpMesh = ({ url, color }) => {
  return (
    <mesh>
      <VtpLoader src={url} />
      <meshStandardMaterial
      attach="material"
      color={color}
      transparent={true}
      opacity={0.5}
      depthWrite={false}
      />
    </mesh>
  ) 
};

const Lights = () => {
  return(
    <group>
      <ambientLight intensity={0.2} color={0xffffff} />
      <hemisphereLight intensity={0.4} />
      <pointLight intensity={0.6} color={0xffffff} position={[-1000, -1000, -1000]}/>
      <pointLight intensity={0.3} color={0xffffff} position={[1000, 1000, 1000]}/>
    </group>
  )
};

const Scene = () => {
  return(
    <>
      <Lights />
      <Controls />
      <group>
        <React.Suspense fallback={null}>
        {
          modelUrls.map((lobe, index) => (
            <VtpMesh 
              key={`${lobe}${index}`} 
              url={`http://192.168.111.20:8080/all_vr/${lobe}.vtp`}
              color={colorMap[lobe]}
            />
          ))
        }
        </React.Suspense>
      </group>
    </>
  )
};

const Controls = () => {
  const controls = useRef();
  const { camera, gl } = useThree();
  useFrame((state) => controls.current.update());
  console.log('controls', controls)
  return(
     <orbitControls ref={controls} args={[camera, gl.domElement]} />
  );
};

const BodyVr = () => {
  return(
    <div className="body-vr">
      <div className="body-vr-content">
        <Canvas
          orthographic={true}
          camera={{ near: 0.1, far: 1e+4 }}
        >
        <Scene />
        </Canvas>
      </div>
    </div>
  )
};

export default BodyVr;
