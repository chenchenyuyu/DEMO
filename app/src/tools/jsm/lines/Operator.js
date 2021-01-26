import * as THREE from "three";
class Operator {
  constructor(control, renderer, scene, vrRadius, vrCenter) {
    const { domElement } = renderer;
    this.domElement = domElement;
    this.mouseDown = false;

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.plane = new THREE.Plane();
    this.planeNormal = new THREE.Vector3();
    this.point = new THREE.Vector3();

    this.lastPoint = new THREE.Vector3();

    this.control = control;
    this.camera = control.object;
    this.scene = scene;
    this.vrRadius = vrRadius;
    this.vrCenter = vrCenter;

    this.lineGroup = new THREE.Group();
    this.scene.add(this.lineGroup);

    this.data = [];

    this.ee = {
      pointerdown: this._onMouseDown.bind(this),
      pointermove: this._onMouseMove.bind(this),
      pointerup: this._onMouseUp.bind(this),
    };
  }

  execute(callBK) {
    // document.addEventListener("pointerdown", this._onMouseDown.bind(this), true);
    // document.addEventListener("pointermove", this._onMouseMove.bind(this), true);
    // document.addEventListener("pointerup", this._onMouseUp.bind(this), true);
    for (const [key, value] of Object.entries(this.ee)) {
      document.addEventListener(key, value, true);
    }

    this.callBK = callBK;
  }

  destroy() {
    // document.removeEventListener("pointerdown", this._onMouseDown, true);
    // document.removeEventListener("pointermove", this._onMouseMove, true);
    // document.removeEventListener("pointerup", this._onMouseUp, true);
    for (const [key, value] of Object.entries(this.ee)) {
      document.removeEventListener(key, value, true);
    }
  }

  _onMouseDown(event) {
    if (event.buttons !== 1) {
      return;
    }
    let isThreeElement = event.path.some(item => {
      if (item.className && typeof item.className === 'string' && (item.className.startsWith('three-element') || item.className.indexOf('three-element') !== -1)) {
        return true;
      }
    });
    if(!isThreeElement) {
      return;
    }
    this.mouseDown = true;
    this.needRemoveLastPoint = false;
    this.lastPoint = this._getPoint(event);
    this.mouseDownPoint = this.lastPoint;
  }

  _onMouseUp(event) {
    this.mouseDown = false;
    this.lastPoint = null;

    if (this.data.length < 3) {
      this.data = [];
      return;
    }

    const { callBK, vrCenter: { x, y, z } } = this;
    if (callBK) {
      const camera = this.control.object;
      const { rotation, position, quaternion } = camera;
      let obj = {
        camera: {
          rotation: {
            x: rotation.x,
            y: rotation.y,
            z: rotation.z,
            order: rotation.order,
          },
          position: {
            x: position.x,
            y: position.y,
            z: position.z,
          },
          quaternion: {
            x: quaternion.x,
            y: quaternion.y,
            z: quaternion.z,
            w: quaternion.w,
          },
          offset: {
            x,
            y,
            z,
          }
        },
        points: this.data,
      };

      callBK(obj);

      this.lineGroup.children = [];
      this.data = [];
    }
  }

  _onMouseMove(event) {
    if (!this.mouseDown) {
      return;
    }

    if (event.buttons !== 1) {
      return;
    }

    if (this.lineGroup.children.length > 2 && this.needRemoveLastPoint) {
      this.lineGroup.children.pop();
    }
    this.needRemoveLastPoint = true;

    this.point = this._getPoint(event);
    this.data.push(this.point.toArray());

    this._addTwoPoints(this.lastPoint, this.point);
    this.lastPoint = this.point;

    this._addTwoPoints(this.point, this.mouseDownPoint);
  }

  _getPoint(event) {
    const { domElement } = this;
    let p = new THREE.Vector3();
    const { mouse, planeNormal, plane, camera, raycaster, scene, vrRadius } = this;
    mouse.x = (event.offsetX / domElement.clientWidth) * 2 - 1;
    mouse.y = -(event.offsetY / domElement.clientHeight) * 2 + 1;
    planeNormal.copy(camera.position).normalize();
    // plane.setFromNormalAndCoplanarPoint(planeNormal, scene.position);
    plane.setComponents(planeNormal.x, planeNormal.y, planeNormal.z, -vrRadius || -300);
    raycaster.setFromCamera(mouse, camera);
    raycaster.ray.intersectPlane(plane, p);
    return p;
  }

  _addTwoPoints(p1, p2) {
    let material = new THREE.LineBasicMaterial({
      color: "#FF0000",
      linewidth: 1,
      linecap: "gap",
    });

    let geometry = new THREE.Geometry();
    geometry.vertices.push(p1);
    geometry.vertices.push(p2);
    let line = new THREE.Line(geometry, material);
    this.lineGroup.add(line);
  }
}
export default Operator;
