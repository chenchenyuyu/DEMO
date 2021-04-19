import React, { useRef, useCallback, useState, useEffect } from 'react';
import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import { Canvas, useFrame, useThree, extend, useUpdate } from 'react-three-fiber';

import Palette from '../../../components/palette/index';
import VtpLoader from '../../../loader/vtpLoader';
import { colorMap, colorMap1 } from './colorMap';
import { saveAs } from 'file-saver';

import './index.less';

extend({ TrackballControls });

const VtpMesh = ({ url, color, updateCamera }) => {
  return (
    <mesh>
      <VtpLoader src={url} onLoad={updateCamera}/>
      <meshPhongMaterial
        attach="material"
        color={color}
        // blending={THREE.NormalBlending}
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


const Scene = ({ colorMap, colorMap1 }) => {
  const lobesGroupRef = useRef(null);
  const updateCamera = useCallback(() => {
    let spheres = [];
    for (let object of lobesGroupRef.current.children) {
      if (object.geometry && object.geometry.boundingSphere) {
        if (object.geometry.boundingSphere.radius !== 0) {
          spheres.push(object.geometry.boundingSphere.clone());
        }
      }
    }
    const { center, radius } = spheres.reduce((sp0, sp1) => {
      if (sp0) {
        const { center: { x: x0, y: y0, z: z0 }, radius: r0 } = sp0;
        const { center: { x: x1, y: y1, z: z1 }, radius: r1 } = sp1;

        const dist = sp0.center.distanceTo(sp1.center);
        const u = [(x1 - x0) / dist, (y1 - y0) / dist, (z1 - z0) / dist];
        const a = new THREE.Vector3(x0 - u[0] * r0, y0 - u[1] * r0, z0 - u[2] * r0);
        const b = new THREE.Vector3(x1 + u[0] * r1, y1 + u[1] * r1, z1 + u[2] * r1);
        return {
          center: new THREE.Vector3((a.x + b.x) / 2, (a.y + b.y) / 2, (a.z + b.z) / 2),
          radius: a.distanceTo(b) / 2
        };
      } else {
        return sp1;
      }
    }, null) || {};
    if (center && radius) {
      lobesGroupRef.current.position.set(-center.x, -center.y, -center.z);
    }
  }, []);
  return(
    <>
      <Lights />
      <Controls />
      <group ref={lobesGroupRef}>
        <React.Suspense fallback={null}>
        {
          Object.keys(colorMap1).map((lobe, index) => (
            <VtpMesh
              key={`${lobe}${index}`} 
              url={`http://192.168.111.20:8080/all_vr/${lobe}.vtp`}
              color={colorMap1[lobe]}
              updateCamera={updateCamera}
            />
          ))
        }
        {/* <mesh>
          <VtpLoader src={`http://192.168.111.20:8080/all_vr/vein.vtp`} onLoad={updateCamera}/>
          <meshPhongMaterial
            attach="material"
            color={'red'}
            transparent={true}
            opacity={0.5}
            depthWrite={false}
          />
        </mesh> */}
        </React.Suspense>
      </group>
    </>
  )
};

const Controls = () => {
  // const controlsRef = useRef();
  const { camera, gl } = useThree();
  const controlsRef = useUpdate((controls) => {
    controls.mouseButtons = { LEFT: 0, MIDDLE: 2, RIGHT: 1 };
    controls.zoomSpeed = -1.2;
    controls.up0.set(0, 0, 1);
    controls.position0.set(0, -300, 0);
    controls.zoom0 = (camera.right - camera.left) /  1000;
    controls.staticMoving = false;
    controls.panSpeed = 0.4;
    controls.reset();
  }, []);
  // camera controls data
  useFrame((state) => controlsRef.current.update());
  return(
     <trackballControls ref={controlsRef} args={[camera, gl.domElement]} />
  );
};

const style = {
  position: 'absolute',
  right: '20px',
  top: '28px',
  zIndex: '99',
};

const btnStyle = {
  width: '50px',
  height: '20px',
  color: 'color',
  marginLeft: '40px', 
  background: '#005FFF',
  borderRadius: '6px',
  textAlign: 'center',
};

const BodyVr = () => {
  const [ threeUrl, setThreeUrl ] = useState(null);
  const [ showPalette, setShowPalette ] = useState(true);
  const [ colorGui, setColorGui ] = useState(colorMap);

  useEffect(() => {
    setTimeout(() => {
      getScreenShot();
    }, 3000)
  }, []);

  const downloadScreenShot = () => {
    const canvas = document.querySelector('.three-element canvas');
    const imageUrl = canvas.toDataURL('image/jpeg', 0.3);
    canvas.toBlob((blob) => saveAs(blob, 'screenShot222' + '.png'));
  };

  const create3DContext = (canvas, opt_attribs) => {
    const names = ["webgl", "experimental-webgl", "webgl2"];
    let context = null;
    for (let ii = 0; ii < names.length; ++ii) {
      try {
        context = canvas.getContext(names[ii], opt_attribs);
      } catch(e) {
        throw new Error('This browser cannot use WebGL !!');
      }
      if (context) {
        break;
      }
    }
    return context;
  };

  const getScreenShot = () => {
    // 0. create canvas
    const threeElement = document.querySelector('.three-element canvas');
    const sourceCanvas = document.createElement('canvas');
    const sourceCtx = sourceCanvas.getContext('2d');
    const destinationCanvas = document.createElement('canvas');
    const destinationCtx = destinationCanvas.getContext('2d');
    // 1. three canvas
    // const gl = threeElement.getContext('webgl', { preserveDrawingBuffer: true });
    const gl = create3DContext(threeElement);
    console.log('gl', gl)
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
    sourceCtx.putImageData(imageData, 0, 0);
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


  return(
    <div className="body-vr">
      <div className="body-vr-header">
        <div style={btnStyle} onClick={downloadScreenShot}>截图</div>
        <Palette
          onChange={setColorGui}
          style={style}
          expand={showPalette}
          onExpand={() => setShowPalette(!showPalette)}
          colors={colorGui}
        />
      </div>
      <div className="body-vr-content">
        {
          !threeUrl &&
          <div>正在截图...</div>
        }
        {
          threeUrl &&
          <img 
          src={threeUrl}
          alt="gray"
          style={{position: 'absolute', top: '0px', left: '0px', width: '570px', height: '400px', borderRadius: '20px'}}/>
        }
        <Canvas
          className="three-element"
          orthographic={true}
          gl={{ preserveDrawingBuffer: true }} 
          camera={{ near: 0.1, far: 1e+4 }}
        >
        <Scene colorMap={colorGui} colorMap1={colorMap1}/>
        </Canvas>
      </div>
    </div>
  )
};

export default BodyVr;
