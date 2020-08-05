import React, { useState, useReducer, useEffect } from 'react';
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
  const [ table, setTable ] = useState([[]]);
  
  useEffect(() => {
    computeTable();
  }, [selectedCell]);

  const computeTable = () => {
    const { row, col } = selectedCell || {};
    let table = [];
    for(let i = 0; i <= row; i++) {
      let newRow = [];
      for(let j = 0; j <= col; j++) {
        let cell = { row: i, col: j };
        newRow.push(cell);
      }
      table.push(newRow);
    }
    setTable(table);
  }
  
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
        {
          table.map((row, i) => (
            <div key={i} className="layout-content-row">
              {
                row.map((col, j) => (
                 <div className="layout-content-col">{i}，{j}</div>
                ))
              }
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default Layout;
