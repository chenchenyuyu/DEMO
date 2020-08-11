import React, { useState } from 'react';
import { SketchPicker } from 'react-color'

import './index.less';


const ColorPicker = () => {
  const [ color, setColor ] = useState('');
  return (
    <div className="color-picker">
      <SketchPicker />
    </div>
  );
};

export default ColorPicker;