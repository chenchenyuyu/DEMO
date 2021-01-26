import React, { useState } from 'react';
import ColorCube from '../colorCube/index';
import { SketchPicker, ChromePicker } from 'react-color';

import './index.less';


const ColorPicker = () => {
  const [ color, setColor ] = useState('red');
  const [ expand, onExpand ] = useState(true);
  return (
    <div className="color-picker">
      <ColorCube color={color} expand={expand} onExpand={onExpand}/>
      {
        expand &&
        <ChromePicker style={{color: '#000'}} color={color} onChangeComplete={({hex}) => setColor(hex)} disableAlpha={true}/>
      }
    </div>
  );
};

export default ColorPicker;