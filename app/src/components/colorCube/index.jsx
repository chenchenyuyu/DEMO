import React from 'react';

import './index.less';

const ColorCube = ({ color, onExpand, expand }) => {
  return(
    <div className="color-cube" onClick={() => onExpand(!expand)}>
      <ul class="color-cube-inner">
        <li class="top" style={{background: color}}></li>
        <li class="bottom" style={{background: color}}></li>
        <li class="front" style={{background: color}}></li>
        <li class="back" style={{background: color}}></li>
        <li class="right" style={{background: color}}></li>
        <li class="left" style={{background: color}}></li>
      </ul>
    </div>
  )
};

export default ColorCube;
