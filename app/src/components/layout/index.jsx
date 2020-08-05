import React, { useState, useReducer } from 'react';
import { AppstoreFilled } from '@ant-design/icons';

import Button from '../button/index';
import LayoutChooser from './layoutChooser/index';

import './index.less';

const btnStyle = {
  display: 'inline-block',
  height: '20px',
  fontSize: '14px',
  textAlign: 'center',
  lineHeight: '20px',
  backgroundColor: '#1f2f8a',
  cursor: 'pointer',
  color: '#fff',
  borderRadius: '6px',
  padding: '0 8px',
  boxShadow: '1px 5px 5px #000',
};

const initSelectedCell = {
  row: -1,
  col: -1,
};
const Layout = () => {
  const [ controller, setController ] = useState(true);
  const [ selectedCell, setSelectedCell ] = useState(initSelectedCell);

  return(
    <div className="layout">
      <div className="layout-header">
      <AppstoreFilled 
        onClick={() => setController(!controller)}
        style={{fontSize: '24px', color: controller ? '#2196F3': '#fff'}}
      />
        {
          controller && 
          <LayoutChooser
            columns={4}
            rows={4}
            setController={setController}
            selectedCell={selectedCell}
            onChange={setSelectedCell}
            />
        }
      </div>
      <div className="layout-content">
        布局主体
      </div>
    </div>
  );
};

export default Layout;