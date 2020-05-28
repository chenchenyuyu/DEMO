import React, { useRef, useMemo, Suspense, useState, useEffect } from 'react';
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
import { Button } from 'antd';
import { saveAs } from 'file-saver';

import { lsdsModel, tracheaModel } from './model';

import './index.less';

extend(TrackballControls);

const VtkLoader = ({ url, getScreenShot }) => {
  const vtk = useLoader(VTKLoader, url);
  useMemo(() => {
    vtk.computeVertexNormals(); // 光滑数据
    vtk.translate(0, 0, 0);
  }, [vtk]);
  return (
    <mesh geometry={vtk} onClick={getScreenShot}>
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

const Scene = ({ model, position, getScreenShot }) => {
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
            <VtkLoader url={url} key={url} getScreenShot={getScreenShot}/>
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
  const [ threeUrl, setThreeUrl ] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      getScreenShot();
    }, 3000)
  }, []);

  const handleScreenShot = () => {
    const canvas = document.querySelector('.canvas-element canvas');
    const imageUrl = canvas.toDataURL('image/jpeg', 0.3);
    canvas.toBlob((blob) => saveAs(blob, 'screenShot' + '.png'));
  };

  const getScreenShot = () => {
    // 0. create canvas
    const threeElement = document.querySelector('.canvas-element canvas');
    const sourceCanvas = document.createElement('canvas');
    const sourceCtx = sourceCanvas.getContext('2d');
    const destinationCanvas = document.createElement('canvas');
    const destinationCtx = destinationCanvas.getContext('2d');
    // 1. three canvas
    const gl = threeElement.getContext('webgl', { preserveDrawingBuffer: true });
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
    const pixels  = new Uint8Array(width * height * 4);
    gl.viewport(0, 0, width, height);
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

    const imageData = new ImageData(new Uint8ClampedArray(pixels), width, height);

    // 2. source canvas 
    sourceCanvas.width = width;
    sourceCanvas.height = height;
    sourceCtx.fillStyle = '#FFFFFF';
    sourceCtx.fillRect(0, 0, width, height);
    sourceCtx.putImageData(getGrayscaleImage(imageData), 0, 0);
    // 3. destination canvas
    destinationCanvas.width = width;
    destinationCanvas.height = height;
    destinationCtx.fillStyle = '#FFFFFF';

    destinationCtx.save();
    destinationCtx.fillRect(0, 0, width, height);
    destinationCtx.scale(1, -1);
    destinationCtx.drawImage(sourceCanvas, 0, -height, width, height);
    destinationCtx.setTransform(1, 0, 0, 1, 0, 0);
    destinationCtx.restore();
    // 4. output imageUrl
    const url = destinationCanvas.toDataURL('image/png', 1);
    setThreeUrl(url);
  };

  const getGrayscaleImage = (pixelsData) => {
    for(let i = 0, len = pixelsData.data.length; i < len; i += 4){
      const gray = Math.max(pixelsData.data[i], pixelsData.data[i+1], pixelsData.data[i+2]) * 1.8;
      pixelsData.data[i] = 255 - gray;
      pixelsData.data[i+1] = 255 - gray;
      pixelsData.data[i+2] = 255 - gray;
    }
    return pixelsData;
  };

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <div style={{textAlign: 'center'}}>
        <Button onClick={handleScreenShot}>截图</Button>
        <Button onClick={getScreenShot}>灰度图</Button>
      </div>
      <img src={threeUrl} alt="gray" style={{position: 'absolute', top: '0px', left: '0px', width: '570px', height: '400px'}}/>
      <Canvas
        className="canvas-element"
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
        <Scene 
          model={lsdsModel}
          getScreenShot={getScreenShot}
          position={[
          -150.36083055745286,
          -120.26194966636896,
          -148.30930405085903
        ]}/>
        <Scene
          model={tracheaModel}
          position={[
          -191.36083055745286,
          -195.26194966636896,
          -159.30930405085903
        ]}/>
      </Canvas>
    </div>
  );
};

export default Vtk;
