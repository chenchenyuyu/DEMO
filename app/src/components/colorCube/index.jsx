import React from 'react';

import './index.less';

const ColorCube = ({ color, onExpand, expand }) => {
  return(
    <div className="color-cube" onClick={() => onExpand(!expand)}>
      <ul className="color-cube-inner">
        <li className="top" style={{background: color}}></li>
        <li className="bottom" style={{background: color}}></li>
        <li className="front" style={{background: color}}></li>
        <li className="back" style={{background: color}}></li>
        <li className="right" style={{background: color}}></li>
        <li className="left" style={{background: color}}></li>
      </ul>
    </div>
  );
};

export default ColorCube;
