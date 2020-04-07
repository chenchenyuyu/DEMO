import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useUpdate, extend, useThree } from 'react-three-fiber'
import * as THREE from 'three';
import vtkXMLPolyDataReader from 'vtk.js/Sources/IO/XML/XMLPolyDataReader';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import DatGui, { DatBoolean, DatColor, DatNumber,DatFolder } from '@tim-soft/react-dat-gui';

extend({ TrackballControls });


const VRLung = ({fileURL='http://192.168.111.97:8080/contour.vtp', materialGui}) => {
    const meshRef = useRef();
    const attribRef = useRef();
    const [bufferObject, setBufferObject] = useState({});
    const [materialArr, setMaterialArr] = useState([]);

    console.log('meshRef',meshRef)
    useFrame(() => {
      if (meshRef.current){
        meshRef.current.rotation.x += 0.01;
        meshRef.current.rotation.y += 0.01;
        // meshRef.current.rotation.z += 0.01;
      }
    });
    useEffect(() => {
      let binary;
      const fetchData = async () => {
        try {
          console.time('vtpReader')
          const resp = await fetch(fileURL);
          binary = await resp.arrayBuffer();
          console.log('binary', binary)
          const vtpReader = vtkXMLPolyDataReader.newInstance();
          console.timeEnd('vtpReader')
          try {
            const parsed = vtpReader.parseAsArrayBuffer(binary);
            if (!parsed) {
              throw Error('parse error');
            }
          } catch (e) {
            // setLoading(false);
            // setError('invalid');
            return;
          }
    
          const source = vtpReader.getOutputData(0);
        console.log('source', source)
        // debug(`creating geometry...`);

        const vertices = source.getPoints().getData();
        const normals = source.getPointData().getNormals().getData();
        const labels = source.getPointData().getArrayByName('Labels').getData();
    
        const tris = source.getPolys().getData();
        const indices = new Uint32Array(source.getPolys().getNumberOfCells() * 3);
    
        let i = 0, j = 0;
        while (j < indices.length) {
          indices[j++] = tris[++i];
          indices[j++] = tris[++i];
          indices[j++] = tris[++i];
          ++i;
        }
    
        const colors = new Float32Array(labels.length * 3);
        setBufferObject({
          vertices,
          normals,
          labels,
          tris,
          indices,
          colors
        });
        source.delete();

        } catch (e) {
          // setLoading(false);
          // setError('network');
          return;
        }
      };
      fetchData();
    }, []);
    const createTexture = (ch) => {
      var fontSize = 50;
      var c = document.createElement('canvas');
      c.width = 128;
      c.height = 32;
      var ctx = c.getContext('2d');
      
      ctx.beginPath();
      ctx.rect(0, 0, 128, 32);
      ctx.fillStyle = "white";
      ctx.fill();

      ctx.fillStyle = "red";
      ctx.font = fontSize+'px Monospace';
      ctx.fillText(ch, 20, 24);

      var texture = new THREE.Texture(c);
      texture.flipY = true;
      // texture.repeat.set( 20, 10 );
      // texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      // texture.encoding = THREE.sRGBEncoding;
      texture.needsUpdate = true;

      return texture;
    }
    const geoRef = useUpdate(geometry => {
      if (Object.values(bufferObject).length > 1) {
        const { vertices, normals, colors, labels, indices } = bufferObject;
        // meshRef.current = geometry;
        geometry.center();
        geometry.computeBoundingSphere();
        // if (geometry) {
        //   const colors = geometry.attributes.color.array;
        //   const labels = geometry.attributes.label.array;
        //   for (let i = 0, j = 0; j < labels.length;) {
        //     if (labels[j++] === 1) {
        //       colors[i++] = 1.;
        //       colors[i++] = 0.88;
        //       colors[i++] = 0.;
        //     } else {
        //       colors[i++] = 1.;
        //       colors[i++] = 1.;
        //       colors[i++] = 0.93;
        //     }
        //   }
        //   attribRef.current.needsUpdate = true;
        //   geometry.attributes.color.needsUpdate = true;
        //   geometry.colorsNeedUpdate = true;
        //   console.log('lasss', labels)
        //   console.log('colssss', colors)
        //   console.log('geometry', geometry)
        // }

        // Initial material
    // const INITIAL_MTL = new THREE.MeshPhongMaterial( { color: 0xf1f1f1, shininess: 10 } );
    // const INITIAL_MAP = [
    //   {lobe: "rightLungUpperLobe", mtl: INITIAL_MTL},
    //   {lobe: "rightLungMiddleLobe", mtl: INITIAL_MTL},
    //   {lobe: "rightLungLowerLobe", mtl: INITIAL_MTL},
    //   {lobe: "leftLungUpperLobe", mtl: INITIAL_MTL},
    //   {lobe: "leftLungLowerLobe", mtl: INITIAL_MTL},
    // ];
        let mats = [], count = 4;
        let v_per_group = indices.length / count;
        geometry.clearGroups();
        // geometry.addGroup(0, vertices.length, 0);
        for ( var i = 0; i < count; i ++ ) {
          geometry.addGroup(i * v_per_group, v_per_group, i);
          let texture =  createTexture("lobe" + (i+1));
          console.log('texture', texture)
          let material =  new THREE.MeshPhongMaterial({ color: new THREE.Color(Math.random() * 0xffffff), ...materialGui, map: texture});
          // let material1 = new THREE.MeshNormalMaterial({ flatShading: false, wireframe: false});
          // if (i === 0) {
          //   material = material1;
          // }
          mats.push(material);
          setMaterialArr(mats);
      }
        // for(let i = 0; i<4; i++){
        //   let material = new THREE.MeshPhongMaterial({ color: new THREE.Color(Math.random() * 0xffffff), ...materialGui});
        //   let material1 = new THREE.MeshNormalMaterial({ flatShading: false, wireframe: false});
        //   if (i === 0) {
        //     material = material1;
        //   }
        //   // if (i === 1) {
        //   //   material = new THREE.MeshPhongMaterial( { color: 0xffffff, map: texture, vertexColors: THREE.VertexColors, } )
        //   // }
        //   mats.push(material);
        //   setMaterialArr(mats);
        // }
        console.log('geometry', geometry)
      }
    }, [bufferObject, materialGui])
  
console.log('data', bufferObject)
console.log('materialArr', materialArr)
if (Object.values(bufferObject).length > 1) {
  const { vertices, normals, colors, labels, indices} = bufferObject;
    return (
        <mesh
        ref={meshRef} 
        material={materialArr}
        // scale={active ? [1.5, 1.5, 1.5] : [1, 1, 1]}
        // onClick={e => setActive(!active)}
        // onPointerOver={e => setHover(true)}
        // onPointerOut={e => setHover(false)}>
        >
        <bufferGeometry attach="geometry" ref={geoRef}>
        <bufferAttribute
          attachObject={['attributes', 'position']}
          count={vertices.length / 3}
          array={vertices}
          itemSize={3}
        />
        <bufferAttribute
          ref={attribRef} 
          attachObject={['attributes', 'color']}
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attachObject={['attributes', 'normal']}
          count={normals.length / 3}
          array={normals}
          itemSize={3}
        />
        <bufferAttribute
          attachObject={['attributes', 'label']}
          count={labels.length / 1}
          array={labels}
          itemSize={1}
        />
        <bufferAttribute attach="index" array={indices} count={indices.length} itemSize={1} />
      </bufferGeometry>
        {/* <meshPhongMaterial 
          attach="material" 
          // color="#F5F5DC" 
          // shininess={50} 
          // specular="#FFFFE0"
          {...materialGui}
          color={hovered ? 'hotpink' : '#F5F5DC'}
          // transparent
          // opacity={0.62}
          // depthTest={true}
          // depthWrite={true}
          // wireframe={true}
          // vertexColors={true}
          /> */}
        </mesh>
      )
    } else {
      return null
    }
}

const Lights = ({light}) => {
  return (
    <group>
      <ambientLight intensity={0.1} color="white"/>
      <hemisphereLight
        {...light.hemiLight}
      />
      <directionalLight
        {...light.nested}
        position={[0,0.1,-0.2]}
      />
        <directionalLight
        // color="#f0f0f0"
        // intensity={0.1}
        {...light.nested}
        position={[0, -0.1, -0.2]}
      />
    </group>
  )
}

const Controls = () => {
  const controls = useRef()
  const { camera, gl } = useThree()
  const mouseButtons = {
    ORBIT: THREE.MOUSE.RIGHT,
    ZOOM: THREE.MOUSE.MIDDLE,
    PAN: THREE.MOUSE.LEFT
  };
  useFrame(() => controls.current.update())
  return <trackballControls ref={controls} args={[camera, gl.domElement]} enableDamping dampingFactor={0.05} rotateSpeed={0.6} mouseButtons={mouseButtons}/>
}

// const Rig = () => {
//   const { camera, scene, intersect } = useThree();
//   const raycaster = new THREE.Raycaster();
//   const mouse = new THREE.Vector2();
//   raycaster.setFromCamera( mouse, camera );
//   // useFrame(() => {
//   //   camera.position.x += (mouse.current[0] / 50 - camera.position.x) * 0.05
//   //   camera.position.y += (-mouse.current[1] / 50 - camera.position.y) * 0.05
//   //   camera.lookAt(0, 0, 0)
//   // })
//   const onMouseClick = (event) => {
//     event.preventDefault();
//     mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
//     mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  
//    const intersects = raycaster.intersectObjects( scene.children );
//    if (intersects.length > 0) {
//      let selectedObject = intersects[0].object;
//      selectedObject.material.color.set( 0xff0000 );
//    }
//    console.log('emmmmm',intersects)
//    console.log('hhhhh', intersect)
//   }
//   useEffect(() => {
//     document.addEventListener( 'click', onMouseClick, false );
//     return () => {
//       document.removeEventListener( 'click', onMouseClick, false );
//     }
//   }, []);
//   return null
// }

const hemisphereLightData = {
  hemiLight: {
    isHemisphereLight: true,
    groundColor: '#808080',
    skyColor: '#FAFAD2',
    intensity: 0.5,
  },
  nested: {
  isDirectionalLight: true,
  color: '#f0f0f0',
  intensity: 0.1
  },
  material: {
    // color:"#F5F5DC",
    shininess:50, 
    // specular:"#FFFFE0",
    // emissive:"#F5F5DC",
    transparent: false,
    opacity: 0.6,
    depthTest: true,
    depthWrite: true,
    alphaTest: 0
  },
};

const LobeGeometryView = () => {
  const deg = THREE.Math.degToRad
  const [guiData, setGuiData] = useState(hemisphereLightData);
  const mouse = useRef([0, 0]);

  const handleUpdate = newData => {
    setGuiData(newData);
  };
    return(
    <div style={{position: 'relative',width: '100%', height: '100%'}}>
      <Canvas
       camera={{ position: [0, 0, 400] }}
      >
        <Lights light={guiData}/>
        <VRLung materialGui={guiData.material}/>
        <Controls />
        {/* <Rig mouse={mouse} /> */}
      </Canvas>
      <DatGui data={guiData} onUpdate={handleUpdate} 
      style={{position: 'absolute', right: '0', top: '0', width: '300px',minWidth: '300px', background: '#5a5b5a'}}
      >
        <DatFolder title="THREE.Material">
        <DatBoolean path="material.transparent" label="transparent" />
        <DatNumber
            path="material.opacity"
            label="opacity"
            min={0}
            max={1}
            step={0.1}
          />
        <DatBoolean path="material.depthTest" label="depthTest" />
        <DatBoolean path="material.depthWrite" label="depthWrite" />
        <DatNumber
            path="material.alphaTest"
            label="alphaTest"
            min={0}
            max={1}
            step={0.1}
          />
         <DatFolder title="THREE.MeshPhongMaterial">
        <DatColor path='material.color' label='color'/>
        {/* <DatColor path='material.emissive' label='emissive'/> */}
        <DatColor path='material.specular' label='specular'/>
        <DatNumber
            path="material.shininess"
            label="shininess"
            min={0}
            max={100}
            step={1}
          />
        </DatFolder>
        </DatFolder>
        <DatFolder title="THREE.HemisphereLight">
        <DatBoolean path="hemiLight.isHemisphereLight" label="hemisphereLight" />
        <DatNumber
            path="hemiLight.intensity"
            label="intensity"
            min={0}
            max={5}
            step={0.1}
          />
        <DatColor path='hemiLight.skyColor' label='skyColor'/>
        <DatColor path='hemiLight.groundColor' label='groundColor'/>
        </DatFolder>
        <DatFolder title="THREE.DirectionalLight">
        <DatBoolean path="nested.isDirectionalLight" label="directionalLight" />
        <DatNumber
            path="nested.intensity"
            label="intensity"
            min={0}
            max={5}
            step={0.1}
          />
        <DatColor path='nested.color' label='color'/>
        </DatFolder>
      </DatGui>
    </div>
    );
}

export default LobeGeometryView;