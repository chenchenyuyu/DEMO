import React, { useRef, useState } from 'react';
import { Canvas, useFrame, extend, useThree } from 'react-three-fiber';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import VtpLoader from './vtpLoader';

extend({ TrackballControls });

const Secne = ({ fileUrl, setLoadTime }) => {
  const { camera, gl } = useThree();
  const controls = useRef();
  useFrame(() => controls.current && controls.current.update());
  return (
    <>
      <trackballControls args={[camera, gl.domElement]} ref={controls} />
      <ambientLight intensity={0.2} color={0xffffff} />
      <hemisphereLight intensity={0.4} />
      <pointLight
        intensity={0.8}
        color={0xffffff}
        position={[1000, -1000, -1000]}
      />
      <pointLight
        intensity={0.5}
        color={0xffffff}
        position={[-1000, 1000, 1000]}
      />
      <mesh>
        <VtpLoader fileURL={fileUrl} onLoadTime={setLoadTime} />
        <meshPhongMaterial specular={0x111111} shininess={40} color={0xffffff}/>
      </mesh>
    </>
  );
};

const Vtp = ({ fileUrl = 'http://192.168.111.20:8080/vtp_test/fracture_vr_raw_no_compress.vtp' }) => {
  const [loadTime, setLoadTime] = useState(0);
  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <div style={{ position: 'absolute', top: '20px', left: '20px' }}>
      {fileUrl}  <br/> <span style={{color: 'red'}}>load time: {loadTime}ms</span>
      </div>
      <Canvas
        camera={{ position: [0, 0, 400], near: 0.1, far: 1e7 }}
        pixelRatio={window.devicePixelRatio}
      >
        <Secne fileUrl={fileUrl} setLoadTime={setLoadTime} />
      </Canvas>
    </div>
  );
};

export default Vtp;
