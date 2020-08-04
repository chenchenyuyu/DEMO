import React, { useRef, useCallback, useState } from 'react';
import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import { Canvas, useFrame, useThree, extend, useUpdate } from 'react-three-fiber';

import Palette from '../../../components/palette/index';
import VtpLoader from '../../../loader/vtpLoader';
import { colorMap } from './colorMap';

import './index.less';

extend({ TrackballControls });

const VtpMesh = ({ url, color, updateCamera, lobe }) => {

  return (
    <mesh renderOrder={lobe === 'body_vr' ? 99 : 0}>
      <VtpLoader src={url} onLoad={updateCamera}/>
      <meshStandardMaterial
      attach="material"
      color={color}
      transparent={true}
      opacity={lobe === 'body_vr' ? 0.2 : 0.5}
      depthWrite={false}
      side={lobe === 'body_vr' ? THREE.DoubleSide : THREE.BackSide}
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


const Scene = ({ colorMap }) => {
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
    // console.log('lobesGroupRef.current.children', lobesGroupRef.current.children)
  }, []);
  return(
    <>
      <Lights />
      <Controls />
      <group ref={lobesGroupRef}>
        <React.Suspense fallback={null}>
        {
          Object.keys(colorMap).map((lobe, index) => (
            <VtpMesh
              lobe={lobe}
              key={`${lobe}${index}`} 
              url={`http://192.168.111.20:8080/all_vr/${lobe}.vtp`}
              color={colorMap[lobe]}
              updateCamera={updateCamera}
            />
          ))
        }
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

const BodyVr = () => {
  const [ showPalette, setShowPalette ] = useState(false);
  const [ colorGui, setColorGui ] = useState(colorMap);

  return(
    <div className="body-vr">
      <div className="body-vr-header">
        <Palette
          onChange={setColorGui}
          style={style}
          expand={showPalette}
          onExpand={() => setShowPalette(!showPalette)}
          colors={colorGui}
        />
      </div>
      <div className="body-vr-content">
        <Canvas
          orthographic={true}
          camera={{ near: 0.1, far: 1e+4 }}
        >
        <Scene colorMap={colorGui}/>
        </Canvas>
      </div>
    </div>
  )
};

export default BodyVr;
