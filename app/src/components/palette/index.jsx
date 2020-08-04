import React from 'react';
import DatGui, {
  DatColor
} from '@tim-soft/react-dat-gui';

import './index.less';

const Palette = ({ style, colors, expand, onExpand, onChange }) => {
  return(
    <div className="palette" style={style}>
      <div className={expand ? 'palette-btn-active': 'palette-btn'} onClick={onExpand} />
      {
        expand &&
        <div className="palette-expand">
        <DatGui
        data={colors}
        onUpdate={onChange}
        style={{
          position: 'absolute',
          right: '0',
          top: '0',
        }}
        >
         {
            Object.keys(colors).map((color) => (
              <DatColor key={color} path={color} label={color} />
            ))
          }
        </DatGui>
        </div>
      }
    </div>
  )
};

export default Palette;
