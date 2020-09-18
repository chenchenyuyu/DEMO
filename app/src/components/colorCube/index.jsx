import React from 'react';

import './index.less';

const ColorCube = ({ color, onExpand, expand }) => {
  return(
    <div className="color-cube" onClick={() => onExpand(!expand)}>
      <ul className="color-cube-inner">
        <li className="top" style={{background: color, opacity: 1}}></li>
        <li className="bottom" style={{background: color, opacity: 0}}></li>
        <li className="front" style={{background: color, opacity: 0.5}}></li>
        <li className="back" style={{background: color, opacity: 0}}></li>
        <li className="right" style={{background: color, opacity: 0}}></li>
        <li className="left" style={{background: color, opacity: 0.8}}></li>
      </ul>
    </div>
  );
};

export default ColorCube;
