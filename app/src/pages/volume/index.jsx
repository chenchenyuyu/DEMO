import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, extend, useThree } from 'react-three-fiber';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';

import * as THREE from 'three';
import * as AMI from 'ami.js';

import './index.less';

extend({ TrackballControls });

const Scene = ({
  fileUrl = 'https://cdn.rawgit.com/FNNDSC/data/master/nifti/eun_brain/eun_uchar_8.nii.gz'
}) => {
  const controls = useRef();
  const { gl, camera, scene } = useThree();
  useFrame(state => controls.current.update());
  // load data
  useEffect(() => {
    (async () => {
      const threeD = document.getElementById('r3d');
      const loader = new AMI.VolumeLoader(threeD);
      const renderer = new THREE.WebGLRenderer({
        alpha: true
      });
      renderer.setSize(threeD.offsetWidth, threeD.offsetHeight);
      threeD.appendChild(renderer.domElement);
      loader.load(fileUrl).then(() => {
        const series = loader.data[0].mergeSeries(loader.data)[0];
        loader.free();
        // loader = null;
        // get first stack from series
        const stack = series.stack[0];
        console.log('AMI', AMI);
        const VolumeHelper = AMI.VolumeRenderingHelperFactory(THREE);
        const vrHelper = new VolumeHelper(stack);
        // const vrHelper = new AMI.VolumeRenderingHelperFactory(stack);
        scene.add(vrHelper);
        console.log('vrHelper', vrHelper);

        // CREATE LUT
        const lutHelper = AMI.lutHelperFactory(THREE);
        const lut = new lutHelper('r3d');
        lut.luts = lutHelper.presetLuts();
        lut.lutsO = lutHelper.presetLutsO();
        // update related uniforms
        lut.lut = 'red'; // red, random, gold, default
        vrHelper.uniforms.uTextureLUT.value = lut.texture;
        vrHelper.uniforms.uLut.value = 1;
        vrHelper.uniforms.uSteps.value = 251;
        vrHelper.uniforms.uAlphaCorrection.value = 0.5;
        vrHelper.uniforms.uShininess.value = 50;

        // let centerLPS = stack.worldCenter();
        // camera.lookAt(centerLPS.x, centerLPS.y, centerLPS.z);
        // camera.updateProjectionMatrix();
        console.log('series', series);
        console.log('stack', stack);
      });
    })();
  }, []);
  return (
    <>
      <trackballControls args={[camera, gl.domElement]} ref={controls} />
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <mesh></mesh>
    </>
  );
};

const Volume = () => {
  return (
    <div id="r3d" style={{ height: '100vh', width: '100%' }}>
      <Canvas camera={{ position: [150, 400, -350], near: 0.1, far: 1e5 }}>
        <Scene />
      </Canvas>
    </div>
  );
};

export default Volume;
