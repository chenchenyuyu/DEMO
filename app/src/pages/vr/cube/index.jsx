import { Scene, Matrix4 } from 'three'
import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useThree, createPortal, useFrame } from 'react-three-fiber';
import { OrbitControls, OrthographicCamera, useCamera } from 'drei';

import './index.less';

const ViewCube = () => {
  const [ hover, setHover ] = useState(null);
  const { gl, scene, camera, size } = useThree();
  const virtualCam = useRef();
  const virtualScene = useMemo(() => new Scene(), []);
  const matrix = new Matrix4();
  const ref = useRef();

  useFrame(() => {
    matrix.getInverse(camera.matrix)
    ref.current.quaternion.setFromRotationMatrix(matrix)
    gl.autoClear = true
    gl.render(scene, camera);
    gl.autoClear = false
    gl.clearDepth();
    gl.render(virtualScene, virtualCam.current);
  }, 1)
  
  return createPortal(
    <>
     <OrthographicCamera ref={virtualCam} makeDefault={false} position={[0, 0, 100]} />
      <mesh
        ref={ref}
        raycast={useCamera(virtualCam)}
        position={[size.width / 2 - 80, -(size.height / 2 - 80), 0]}
        onPointerOut={(e) => setHover(null)}
        onPointerMove={(e) => setHover(Math.floor(e.faceIndex / 2))}
        >
      {[...Array(6)].map((_, index) => (
          <meshPhongMaterial attachArray="material" key={index} color={hover === index ? 'hotpink' : 'white'} />
      ))}
      <boxBufferGeometry attach="geometry" args={[60, 60, 60]} />
      </mesh>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
    </>,
    virtualScene
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
      <ViewCube />
      </Canvas>
    </div>
  )
};

export default Cube;
