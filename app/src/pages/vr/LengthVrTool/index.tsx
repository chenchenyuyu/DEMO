import * as THREE from 'three';
import React, { useMemo, useState, useCallback, useRef, useEffect, useLayoutEffect } from 'react';
import { useThree, useFrame } from 'react-three-fiber';
import { CSS2DRenderer, CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer.js";

type LineProps = {
  visible?: boolean,
  color: string,
  activeColor: string,
  startPoint: number[],
  endPoint: number[],
  label?: string,
  onStart: (v: number[]) => void,
  onEnd: (v: number[]) => void,
  onDelete?: (e: MouseEvent) => void,
};

type PointProps = {
  onDrag: (v: THREE.Vector3) => void,
  position: number[],
  color: string,
  activeColor: string,
}

const useHover = (stopPropagation = true) => {
  const [hovered, setHover] = useState(false);

  const hover = useCallback((e) => {
    if(stopPropagation) {
      e.stopPropagation();
    }
    setHover(true);
  }, [stopPropagation]);

  const unhover = useCallback((e) => {
    if(stopPropagation) {
      e.stopPropagation();
    }
    setHover(false);
  }, []);

  const [ bind ] = useState(() => ({ onPointerOver: hover, onPointerOut: unhover }));
  return [ bind, hovered ];
};

const useDrag = (onDrag: (v: THREE.Vector3) => void, onEnd?: () => void) => {
  const { gl, raycaster, camera } = useThree();
  const mouseRef = useRef(new THREE.Vector2());
  const [ active, setActive ] = useState(false);
  const [ plane, planeNormal ] = useMemo(() => [new THREE.Plane(), new THREE.Vector3()], []);
  const domElement = gl.domElement;

  const down = useCallback((e) => {
    e.stopPropagation();
    domElement.style.cursor = 'pointer';
    setActive(true);
    if (typeof e.target.setPointerCapture === 'function') {
      e.target.setPointerCapture(e.pointerId);
    }
  }, []);

  const up = useCallback((e) => {
    e.stopPropagation();
    setActive(false);
    domElement.style.cursor = 'auto';
    if (typeof e.target.releasePointerCapture === 'function') {
      e.target.releasePointerCapture(e.pointerId);
    }
    if (onEnd) onEnd();
  }, [onEnd]);

  const activeRef = useRef<boolean>()
  useEffect(() => void (activeRef.current = active));

  const getPlanePoint = (event: MouseEvent) => {
    let p = new THREE.Vector3();

    const rect = domElement.getBoundingClientRect();
    mouseRef.current.x  = (( event.clientX - rect.left ) / rect.width) * 2 - 1;
		mouseRef.current.y = - (( event.clientY - rect.top ) / rect.height) * 2 + 1;

    planeNormal.copy(camera.position).normalize();
    plane.setComponents(planeNormal.x, planeNormal.y, planeNormal.z, -10);
    raycaster.setFromCamera(mouseRef.current, camera);
    raycaster.ray.intersectPlane(plane, p);
    return p;
  }

  const move = useCallback((e) => {
    if (activeRef.current) {
      domElement.style.cursor = 'move';
      e.stopPropagation();
      const p = getPlanePoint(e);
      onDrag(p);
    }
  }, [onDrag, getPlanePoint]);

  const [ bind ] = useState(() => ({ onPointerDown: down, onPointerUp: up, onPointerMove: move }));
  return [ bind ];
};

const Point = ({ position, color, activeColor, onDrag }: PointProps) => {
  const [ bindDrag ] = useDrag(onDrag);
  const [ bindHover, hovered ] = useHover();
  return(
    <mesh
      {...bindDrag}
      {...bindHover}
      position={useMemo(() => new THREE.Vector3(...position), [position])}>
      <sphereGeometry attach="geometry" args={[1, 8, 6 ]} />
      <meshBasicMaterial attach="material" color={hovered ? activeColor : color}/>
    </mesh>
  );
};

const Line = ({ color, activeColor, startPoint, endPoint, label, onStart, onEnd, onDelete } : LineProps) => {
  const vertices = useMemo(() => [startPoint, endPoint].map(v => v && new THREE.Vector3(...v)), [startPoint, endPoint]);
  const update = useCallback(self => ((self.verticesNeedUpdate = true), self.computeBoundingSphere()), []);
  const lineRef = useRef<THREE.Line>(null!);

  const [ bindHover, hovered ] = useHover();
  const [clicked, setClicked] = useState(false);

  const { p1, p2, d } = useMemo(() => {
    const p1 = startPoint && new THREE.Vector3(...startPoint);
    const p2 = endPoint && new THREE.Vector3(...endPoint);
    let d;
    if (p1 && p2) {
      d = p1.distanceTo(p2);
    }
    return { p1, p2, d };
  }, [startPoint, endPoint]);

  const lineColor = (hovered || clicked) ? activeColor : color;

  useLayoutEffect(() => {
    if (lineRef.current && p2 && d) {
      //create label dom element
      const div = document.createElement('div');
      div.className = 'label';
      div.textContent = d ? `${d.toFixed(2)} mm` :`${label} mm`;
      div.style.color = lineColor;
      div.style.borderRadius = '4px';
      div.style.pointerEvents = "none";
      const obj = new CSS2DObject(div);
      obj.position.copy(p2);
      obj.translateZ(-5);
      obj.translateX(5);
      lineRef.current.add(obj);
      return () => {
        lineRef.current.remove(obj);
      }
    }
  }, [lineRef, label, p2, d, lineColor]);

  const contextMenuCallback = useCallback((e) => {
    if (lineRef.current && onDelete) {
      e.object.children.forEach((obj: THREE.Object3D) => {
        if(obj.name === 'delete') {
          lineRef.current.remove(obj);
        }
      });
      //create label dom element
      const div = document.createElement('div');
      div.className = 'delete';
      div.textContent = '删除';
      div.style.color = '#fff';
      div.style.padding = '4px 6px';
      div.style.borderRadius = '4px';
      div.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';

      const obj = new CSS2DObject(div);
      obj.name = "delete";
      obj.position.copy(e.point);
      lineRef.current.add(obj);
      div.addEventListener('mousedown', onDelete);
      return () => {
        lineRef.current.remove(obj);
        div.removeEventListener('mousedown', onDelete);
      }
    }
  }, [lineRef, onDelete]);

 return(
   <group 
      name="line"
      {...bindHover}
      onClick={() => setClicked(!clicked)}
      onContextMenu={contextMenuCallback}>
      {
        startPoint && endPoint &&
        <line ref={lineRef as any}>
          <geometry attach="geometry" vertices={vertices} onUpdate={update}/>
          <lineBasicMaterial attach="material" color={lineColor}/>
        </line>
      }
      {
        startPoint &&
          <Point 
            position={startPoint}
            color={lineColor}
            activeColor={activeColor}
            onDrag={(v: THREE.Vector3) => onStart(v.toArray())}
        />
      }
      {
        endPoint &&
          <Point
            position={endPoint}
            color={lineColor}
            activeColor={activeColor}
            onDrag={(v: THREE.Vector3) => onEnd(v.toArray())}
        />
      }
   </group>
 );
};

const useCSS2DRenderer = () => {
  const { scene, camera, size, gl } = useThree();
  const [ css2drender ] = useState(() => (new CSS2DRenderer() as unknown) as THREE.WebGLRenderer)
  const css2dElement = css2drender.domElement;
  css2dElement.className = "label-container";
  css2dElement.style.position = "absolute";
  css2dElement.style.width = "100%";
  css2dElement.style.top = "0px";

  useLayoutEffect(() => {
      if(gl && gl.domElement.parentNode) {
        if (gl.domElement.parentNode.parentNode) {
          gl.domElement.parentNode.parentNode.prepend(css2dElement);
        }
      }
  }, [gl, css2dElement]);

  useFrame(() => {
    if (css2drender) {
      css2drender.setSize(size.width, size.height)
      css2drender.render(scene, camera);
    }
  });
}

type LengthVrToolType = {
  active: boolean,
  position: THREE.Vector3,
};

interface ILine {
  id?: number,
  startPoint: number[],
  endPoint: number[],
};

const LengthVrTool = ({ active, position }: LengthVrToolType) => {
  useCSS2DRenderer();
  const mouseRef = useRef(new THREE.Vector2());
  const startPointRef = useRef<THREE.Vector3>(null!);
  const endPointRef = useRef<THREE.Vector3>(null!);

  const { camera, raycaster, gl, scene } = useThree();
  const domElement = gl.domElement;
  const [ lines, setLines ] = useState<ILine[]>([]);

  const onPointerDown = (event: MouseEvent) => {
    if (event.which === 3 || event.which === 2) {
      return;
    }
    mouseRef.current.x = (event.offsetX / domElement.clientWidth) * 2 - 1;
    mouseRef.current.y = -(event.offsetY / domElement.clientHeight) * 2 + 1;
    raycaster.setFromCamera(mouseRef.current, camera);

    const items = raycaster.intersectObjects(scene.children, true);
    if(items.length > 0) {
      const { object, point } = items[0];
      if(object.type !== 'Line' && object.parent!.name !== 'line') {
        const p = point.clone();
        if(!startPointRef.current) {
          startPointRef.current = p;
        } else if (!endPointRef.current) {
          endPointRef.current = p;
        }
      }
    }
  }

  const onPointerUp = () => {
    const p1 = startPointRef.current;
    const p2 = endPointRef.current;
    if(p1 || p2) {
      setLines(lines => {
        const data = [...lines].filter(({ endPoint }) => (endPoint));
        return ([...data, { startPoint: startPointRef.current && startPointRef.current.toArray(), endPoint: endPointRef.current && endPointRef.current.toArray() }])
      });
    }
    if (p1 && p2) {
      startPointRef.current = null as any;
      endPointRef.current = null as any;
    }
  };

  useEffect(() => {
    if(active) {
      domElement.addEventListener('pointerdown', onPointerDown);
      domElement.addEventListener('pointerup', onPointerUp);
    }
    return () => {
      domElement.removeEventListener('pointerdown', onPointerDown);
      domElement.removeEventListener('pointerup', onPointerUp);
    }
  }, [active]);

  const updateLines = (obj: { [key: string]: number[] }, index: number) => {
    setLines(lines.map((line, i) => i === index ? {...line, ...obj } : line));
  };

  const deleteLine = (e: MouseEvent, index: number) => {
    e.stopPropagation();
    const arr = [...lines];
    arr.splice(index, 1);
    setLines(arr);
  };

   return(
    <group name="lines" position={position}>
      {
        lines.map(({ startPoint, endPoint }, index) => (
          <Line
            key={Math.random()}
            startPoint={startPoint}
            endPoint={endPoint}
            color={'#2AC7F6'}
            activeColor={'#90FFDE'}
            onStart={(startPoint: number[]) => {
              updateLines({ startPoint }, index);
            }}
            onEnd={(endPoint: number[]) => {
              updateLines({ endPoint }, index);
            }}
            onDelete={(e: MouseEvent) => deleteLine(e, index)}
          />
        ))
      }
    </group>);
};

export default LengthVrTool;

export { useCSS2DRenderer };