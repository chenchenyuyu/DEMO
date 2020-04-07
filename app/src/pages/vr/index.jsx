import React from 'react';
import { Breadcrumb, Menu } from 'antd';

const menu = (
  <Menu>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="/gltf">
        fractureChest gltf vr
      </a>
    </Menu.Item>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="/lobes">
        lobes vr
      </a>
    </Menu.Item>
  </Menu>
);

const Vr = () => {
  return (
    <div style={{ textAlign: 'center', fontSize: '20px' }}>
      <Breadcrumb>
        <Breadcrumb.Item href="/">
          <span>主页</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item overlay={menu}>
          <a href="/gltf">Vr demo</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item href="/com">
          <span>Com demo</span>
        </Breadcrumb.Item>
      </Breadcrumb>
    </div>
  );
};

export default Vr;
