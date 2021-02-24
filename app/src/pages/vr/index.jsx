import React from 'react';
import { Breadcrumb, Menu } from 'antd';
import Gltf from './gltf/index';

import './index.less';

const menu = (
  <Menu>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="/gltf">
        gltf vr
      </a>
    </Menu.Item>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="/vtp">
        vtp vr
      </a>
    </Menu.Item>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="/vtk">
        vtk vr
      </a>
    </Menu.Item>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="/lobes">
        lobes vr
      </a>
    </Menu.Item>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="/decal">
        decal vr
      </a>
    </Menu.Item>
    <Menu.Item>
      <a href="_blank" rel="noopener noreferrer" href="/body">
        body vr
      </a>
    </Menu.Item>
    <Menu.Item>
      <a href="_blank" href="/stl">stl vr</a>
    </Menu.Item>
  </Menu>
);

const menuVolume = (
  <Menu>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="/volumeRender">
        volumeRender
      </a>
    </Menu.Item>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="/loaderDicom">
        loaderDicom
      </a>
    </Menu.Item>
  </Menu>
);

const fiberVolume = (
  <Menu>
   <Menu.Item>
     <a target="_blank" href="/volumetricLight">
      volumetricLight
     </a>
   </Menu.Item>
   <Menu.Item>
     <a href="/cube" target="_blank" rel="noopener noreferrer">
       cube
     </a>
   </Menu.Item>
   <Menu.Item>
     <a href="/line">line</a>
   </Menu.Item>
  </Menu>
);

const Vr = () => {
  return (
    <div style={{ textAlign: 'center', fontSize: '20px' }}>
      <Breadcrumb>
        <Breadcrumb.Item href="/">
          <span>home page</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <a href="https://wiki.fileformat.com/3d/obj/">3d fileformat</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item overlay={menu}>
          <a href="/gltf">Vr demo</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item href="/com">
          <span>Com demo</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item overlay={menuVolume}>
          <a href="/volumeRender">Volume demo</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item overlay={fiberVolume}>
          <a href="/volumetricLight">fiber demo</a>
        </Breadcrumb.Item>
      </Breadcrumb>
      <div>
        <Gltf />
      </div>
    </div>
  );
};

export default Vr;
