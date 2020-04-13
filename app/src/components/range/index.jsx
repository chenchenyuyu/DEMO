import React, { useState, useRef, useMemo, useEffect } from 'react';

import './index.less';

const Range = ({ title = 'MinIP', min = 1, max = 25, step = 1, onChange }) => {
  const [value, setValue] = useState(1);
  const indicatorRef = useRef(null);

  let marks = useMemo(() => {
    let marksArr = [];
    for (let i = max; i > 0; i -= step) {
      marksArr.push(i);
    }
    return marksArr;
  }, [min, max, step]);

  const mouseEventHandler = e => {
    e.stopPropagation();
    const indicatorBarHeight = indicatorRef.current.clientHeight;
    const { top } = e.currentTarget.getBoundingClientRect();
    const calibration = 1.0 / max / 2;
    const percentage =
      (indicatorBarHeight - (e.nativeEvent.clientY - top)) /
        indicatorBarHeight -
      calibration;
    const activeIndex = Math.floor(Math.max(percentage, 0) * max) + min;
    setValue(activeIndex);
    if (onChange) {
      onChange(activeIndex);
    }
  };

  return (
    <div className="range">
      <div className="range-title">{title}</div>
      <div className="range-label">{max}mm</div>
      <div
        ref={indicatorRef}
        className="range-marks"
        style={{ position: 'relative' }}
        onMouseDown={mouseEventHandler}
      >
        {marks.map(index => {
          return (
            <div
              key={index}
              style={{
                width: '8px',
                height: '1px',
                background: index <= value ? '#3F87F5' : '#fff',
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
            alignItems: 'center',
            cursor: 'pointer'
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
