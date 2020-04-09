import React, { useState, useRef } from 'react';

import './index.less';

const Range = ({
  min = 1,
  max = 25,
  step = 1,
  onChange,
  labelTop = 'MinIP'
}) => {
  const [value, setValue] = useState(6);
  const indicatorRef = useRef(null);

  let marks = [];
  for (let i = max; i > 0; i -= step) {
    marks.push(i);
  }
  const mouseEventHandler = e => {
    const indicatorBarHeight = indicatorRef.current.clientHeight;
    const { top } = e.currentTarget.getBoundingClientRect();
    const calibration = 1.0 / max / 2;
    const percentage =
      (indicatorBarHeight - (e.nativeEvent.clientY - top)) /
        indicatorBarHeight -
      calibration;
    const slice = Math.floor(Math.max(percentage, 0) * max) + min;
    setValue(slice);
  };
  return (
    <div className="range">
      <div className="range-title">{labelTop}</div>
      <div className="range-label">{max}mm</div>
      <div
        ref={indicatorRef}
        className="range-marks"
        style={{ position: 'relative' }}
        onMouseDown={mouseEventHandler}
      >
        {marks.map(i => {
          return (
            <div
              key={i}
              style={{
                width: '8px',
                height: '1px',
                background: i < value ? '#3F87F5' : '#fff',
                marginBottom: '8px',
                marginLeft: '12px'
              }}
            ></div>
          );
        })}
        <div
          className="arrow"
          style={{
            width: '50px',
            position: 'absolute',
            bottom: `${((value - 1) * 100) / max}%`,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <div
            style={{
              width: '24px',
              height: '3px',
              background: '#3F87F5',
              marginLeft: '12px',
              borderRadius: '3px'
            }}
          ></div>
        </div>
      </div>
      <div className="range-label">层数{value}</div>
    </div>
  );
};

export default Range;
