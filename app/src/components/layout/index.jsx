import React, { useState, useReducer } from 'react';
import Button from '../button/index';

import './index.less';

const btnStyle = {
  display: 'inline-block',
  height: '20px',
  fontSize: '14px',
  textAlign: 'center',
  lineHeight: '20px',
  backgroundColor: '#3a6b71',
  cursor: 'pointer',
  color: '#fff',
  borderRadius: '6px',
  padding: '0 8px',
  boxShadow: '1px 5px 5px #590D88',
};

const Layout = () => {
  const [ controller, setController ] = useState(true);
  return(
    <div className="layout">
      <Button style={btnStyle} onClick={() => setController(!controller)}>布局</Button>
      {
        controller && 
        <div className="layout-controller">
          <>
          <div className="layout-controller-item">1</div>
          <div className="layout-controller-item">2</div>
          <div className="layout-controller-item">3</div>
          <div className="layout-controller-item">4</div>
          <div className="layout-controller-item">5</div>
          </>
          <>
          <div className="layout-controller-item">1</div>
          <div className="layout-controller-item">2</div>
          <div className="layout-controller-item">3</div>
          <div className="layout-controller-item">4</div>
          <div className="layout-controller-item">5</div>
          </>
          <>
          <div className="layout-controller-item">1</div>
          <div className="layout-controller-item">2</div>
          <div className="layout-controller-item">3</div>
          <div className="layout-controller-item">4</div>
          <div className="layout-controller-item">5</div>
          </>
          <>
          <div className="layout-controller-item">1</div>
          <div className="layout-controller-item">2</div>
          <div className="layout-controller-item">3</div>
          <div className="layout-controller-item">4</div>
          <div className="layout-controller-item">5</div>
          </>
        </div>
      }
      <div className="layout-content">
        布局主体
      </div>
    </div>
  );
};

export default Layout;