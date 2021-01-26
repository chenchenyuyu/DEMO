// import React, { useRef, useState, useEffect } from 'react';
// import { Canvas, useFrame, extend, useThree } from 'react-three-fiber';
// import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';

// import * as THREE from 'three';
// import * as AMI from 'ami.js';
// import DatGui, {
//   DatSelect
// } from '@tim-soft/react-dat-gui';

// extend({ TrackballControls });

// const Scene = ({
//   fileUrl = 'http://192.168.111.20:8080/ami/eun_uchar_8.nii.gz',
//   guiData,
// }) => {
//   const [ stackData, setStackData ] = useState(null);
//   const controls = useRef();
//   const { gl, camera, scene } = useThree();
//   useFrame(state => controls.current.update());
//   // load data
//   useEffect(() => {
//     (async () => {
//       const threeD = document.getElementById('r3d');
//       const loader = new AMI.VolumeLoader(threeD);
//       const renderer = new THREE.WebGLRenderer({
//         alpha: true
//       });
//       renderer.setSize(threeD.offsetWidth, threeD.offsetHeight);
//       threeD.appendChild(renderer.domElement);
//       loader.load(fileUrl).then(() => {
//         const series = loader.data[0].mergeSeries(loader.data)[0];
//         loader.free();
//         // loader = null;
//         // get first stack from series
//         const stack = series.stack[0];
//         setStackData(stack);
//         console.log('AMI', AMI);
//         const VolumeHelper = AMI.VolumeRenderingHelperFactory(THREE);
//         const vrHelper = new VolumeHelper(stack);
//         // const vrHelper = new AMI.VolumeRenderingHelperFactory(stack);
//         scene.add(vrHelper);
//         console.log('vrHelper', vrHelper);

//         // CREATE LUT
//         const lutHelper = AMI.lutHelperFactory(THREE);
//         const lut = new lutHelper('r3d');
//         lut.luts = lutHelper.presetLuts();
//         lut.lutsO = lutHelper.presetLutsO();
//         // update related uniforms
//         lut.lut = 'muscle_bone'; // red, random, gold, default
//         lut.lut0 = 'linear_full';

//         vrHelper.uniforms.uTextureLUT.value = lut.texture;
//         vrHelper.uniforms.uLut.value = 1;
//         vrHelper.uniforms.uSteps.value = 251;
//         vrHelper.uniforms.uAlphaCorrection.value = 0.5;
//         vrHelper.uniforms.uShininess.value = 50;

//         // let centerLPS = stack.worldCenter();
//         // camera.lookAt(centerLPS.x, centerLPS.y, centerLPS.z);
//         // camera.updateProjectionMatrix();
//         console.log('series', series);
//         console.log('stack', stack);
//       });
//     })();
//   }, []);

//   useEffect(() => {
//     // UPDATE LUT
//     const lutHelper = AMI.lutHelperFactory(THREE);
//     const lut = new lutHelper('r3d');
    
//     lut.luts = lutHelper.presetLuts();
//     lut.lutsO = lutHelper.presetLutsO();
//     lut.lutsAvailable();

//     // update related uniforms
//     lut.lut = guiData.lutSelect; // red, random, gold, default
//     lut.lut0 = 'linear_full';
// }, [guiData]);

//   return (
//     <>
//       <trackballControls args={[camera, gl.domElement]} ref={controls} />
//       <ambientLight />
//       <pointLight position={[10, 10, 10]} />
//     </>
//   );
// };
// const initGuiData= {
//   lutSelect: 'muscle_bone'
// }
// const Volume = () => {
//   const [ guiData, setGuiData ] = useState(initGuiData);
//   const handleUpdate = (newData) => {
//     setGuiData(newData);
//   };
//   return (
//     <div id="r3d" style={{ height: '100vh', width: '100%' }}>
//       <Canvas camera={{ position: [150, 400, -350], near: 0.1, far: 1e5 }}>
//         <Scene guiData={guiData}/>
//       </Canvas>
//       <DatGui
//        data={guiData}
//        onUpdate={handleUpdate}
//        style={{
//         position: 'absolute',
//         right: '0',
//         top: '0',
//         width: '300px',
//         minWidth: '300px',
//         background: '#5a5b5a'
//       }}
//       >
//       <DatSelect
//         style={{color: '#000'}}
//         label="lut"
//         path="lutSelect"
//         options={["default", "spectrum", "hot_and_cold", "gold", "red", "green", "blue", "walking_dead","random", "muscle_bone"]}
//       />
//       </DatGui>
//     </div>
//   );
// };

// export default Volume;
