// import React, { useRef, useEffect } from 'react';
// import { Canvas, extend, useThree, useFrame } from 'react-three-fiber';
// import * as THREE from 'three';
// import * as AMI from 'ami.js';

// import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';

// extend(TrackballControls);

// const Scene = () => {
//   const { gl, camera } = useThree();
//   const controls = useRef();
//   useFrame(state => controls.current.update());
//   let suffix = ['36444280', '36444294', '36444308'];

//   let files = suffix.map(
//     v => `https://cdn.rawgit.com/FNNDSC/data/master/dicom/adi_brain/${v}`
//   );

//   useEffect(() => {
//     (async () => {
//       // renderer
//       const threeD = document.getElementById('r3d');
//       const renderer = new THREE.WebGLRenderer({
//         antialias: true
//       });
//       renderer.setSize(threeD.offsetWidth, threeD.offsetHeight);
//       renderer.setClearColor(0x673ab7, 1);
//       renderer.setPixelRatio(window.devicePixelRatio);
//       threeD.appendChild(renderer.domElement);
//       const loader = new AMI.VolumeLoader(threeD);
//     })();
//   }, []);
//   return (
//     <>
//       <trackballControls args={[camera, gl.domElement]} ref={controls} />
//       <ambientLight />
//       <pointLight position={[10, 10, 10]} />
//     </>
//   );
// };

// const LoaderDicom = () => {
//   return (
//     <div id="r3d" style={{ height: '100vh', width: '100%' }}>
//       <Canvas camera={{ position: [250, 250, 250], near: 0.1, far: 1e5 }}>
//         <Scene />
//       </Canvas>
//     </div>
//   );
// };
// export default LoaderDicom;
