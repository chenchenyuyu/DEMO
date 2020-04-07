import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';

import { Canvas, useFrame, extend, useThree } from 'react-three-fiber';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
// import * as AMI from 'ami.js';

import './index.less';

extend({ TrackballControls });
// window['THREE'] = THREE;

const Scene = ({
  fileUrl = 'https://cdn.rawgit.com/FNNDSC/data/master/nifti/eun_brain/eun_uchar_8.nii.gz'
}) => {
  const controls = useRef();
  // const { gl, camera, scene } = useThree();
  // useFrame(state => controls.current.update());
  // load data
  // useEffect(() => {
  //   (async () => {
  //     const threeD = document.getElementById('r3d');
  //     const loader = new VolumeLoader(threeD);
  //     const renderer = new THREE.WebGLRenderer({
  //       alpha: true
  //     });
  //     renderer.setSize(threeD.offsetWidth, threeD.offsetHeight);
  //     threeD.appendChild(renderer.domElement);
  //     loader.load(fileUrl).then(() => {
  //       const series = loader.data[0].mergeSeries(loader.data)[0];
  //       loader.free();
  //       loader = null;
  //       // get first stack from series
  //       const stack = series.stack[0];
  //       console.log('stack', stack);
  //     });
  //   })();
  // }, []);
  return (
    <>
      <TrackballControls ref={controls} />
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <mesh></mesh>
    </>
  );
};

const Volume = () => {
  return (
    <div id="r3d">
      <Canvas position={[0, 0, 300]}>
        <Scene />
      </Canvas>
    </div>
  );
};

export default Volume;
