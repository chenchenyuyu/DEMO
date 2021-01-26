import React, { useRef, useState } from 'react';
import { Canvas, useFrame, extend, useThree } from 'react-three-fiber';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import DatGui, {
  DatColor,
  DatSelect,
} from '@tim-soft/react-dat-gui';

import VtpLoader from './vtpLoader';
import Material from '../../../components/material/index';
import { materialMap } from '../../../components/material/materialMap';

extend({ TrackballControls });

const Scene = ({ fileUrl, setLoadTime, color, type }) => {
  const { camera, gl } = useThree();
  const controls = useRef();
  useFrame(() => controls.current && controls.current.update());
  return (
    <>
      <trackballControls args={[camera, gl.domElement]} ref={controls} />
      <ambientLight intensity={0.2} color={0xffffff} />
      <hemisphereLight intensity={0.4} />
      <pointLight intensity={0.6} color={0xffffff} position={[-1000, -1000, -1000]}/>
      <pointLight intensity={0.3} color={0xffffff} position={[1000, 1000, 1000]}/>
      <mesh>
        <VtpLoader fileURL={fileUrl} onLoadTime={setLoadTime} />
        <Material
          type={type}
          attach="material"
          transparent={true}
          opacity={0.5}
          shininess={40}
          color={color}
          depthWrite={false}
          />
      </mesh>
    </>
  );
};

const initGuiData = {
  color: '#133BDD',
  material: 'meshBasicMaterial',
};

const Vtp = ({ fileUrl = 'http://192.168.111.20:8080/vtp_test/vein-1-main.vtp' }) => {
  const [ loadTime, setLoadTime ] = useState(0);
  const [ guiData, setGuiData ] = useState(initGuiData);
 
  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <div style={{ position: 'absolute', top: '20px', left: '20px' }}>
        {fileUrl}  <br/> <span style={{color: 'red'}}>load time: {loadTime}ms</span>
      </div>
      <DatGui
        data={guiData}
        onUpdate={setGuiData}
        style={{
          position: 'absolute',
          right: '0',
          top: '0',
          width: '300px',
          minWidth: '300px',
          background: '#5a5b5a',
          zIndex: '9999'
        }}
      >
        <DatColor path="color" label="Color" />
        <DatSelect path="material" label="Material" options={materialMap} style={{color: 'rgb(117 97 15)'}}/>
      </DatGui>
      <Canvas
        camera={{ position: [0, 0, 400], near: 0.1, far: 1e7 }}
        pixelRatio={window.devicePixelRatio}
      >
        {/* <Scene fileUrl={fileUrl} setLoadTime={setLoadTime} color={guiData.color}/> */}
        <Scene fileUrl={'http://192.168.111.20:8080/vtp_test/vein-1-main.vtp'} setLoadTime={setLoadTime} color={guiData.color} type={guiData.material}/>
      </Canvas>
    </div>
  );
};

export default Vtp;
