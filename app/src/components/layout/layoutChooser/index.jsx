import React, { useState, useEffect } from 'react';

import './index.less';

// TODO: fix hover error
const emptyCell = {
  row: -1,
  col: -1
};  

const colStyle = (boxSize) => {
  return {
    width: `${boxSize}px`,
    height: `${boxSize}px`,
    lineHeight: `${boxSize}px`,
    display: 'inline-block',
    borderRight: '1px solid #393d3e',
    borderBottom: '1px solid #393d3e',
    textAlign: 'center',
    cursor: 'pointer',
  };
}

const LayoutChooser = ({ 
    selectedCell = {row: -1, col: -1},
    rows = 3,
    columns = 3,
    boxSize = 50,
    boxBorder = 1,
    setController,
    onChange
     }) => {
  const [ table, setTable ] = useState([[]]);
  
  useEffect(() => {
    highlightCells(emptyCell);
  }, []);

  const highlightCells = (currentCell) => {
    let table = [];
    for (let row = 0; row < rows; row++ ) {
      let newRow = [];
      for (let col = 0; col < columns; col++) {
        let cell = { row: row, col: col };
        if (isRange(cell, currentCell)) {
          cell.className = 'layout-chooser-hover';
        } else if (isRange(currentCell, emptyCell) && isRange(cell, selectedCell)) {
          cell.className = 'layout-chooser-selectedBefore';
        }
        newRow.push(cell);
      }
      table.push(newRow);
    }
    setTable(table);
  };

  const onClick = (currentCell) => {
    highlightCells(currentCell);
    if (onChange) { onChange(currentCell); }
    setController(false);
  };

  const isRange = (cell = {}, parentCell = {}) => {
    return cell.row <= parentCell.row && parentCell.col <= parentCell.col;
  };

  return(
    <div
      className="layout-chooser"
      style={{width: (columns * boxSize + (columns - 1) * boxBorder)}}
      >
      {
        table.map((row, i) => (
        <div key={i} className="layout-chooser-row">
          {row.map((cell, j) => (
            <div
              key={j}
              style={colStyle(boxSize)}
              className={cell.className}
              onMouseEnter={() => highlightCells(cell)}
              onMouseLeave={() => highlightCells(emptyCell)}
              onClick={() => onClick(cell)}
              >
              {i}，{j}
            </div>
            ))}
        </div>
        ))
      }
    </div>
  )
};

export default LayoutChooser;
