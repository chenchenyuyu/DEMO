import React, { useRef, useMemo } from 'react';

import './index.less';

/* eslint-disable react/prop-types */

const Slider = ({ value, title = 'MinIP', min = 1, max = 20, step = 1, onChange }) => {
  const indicatorRef = useRef(null);

  let marks = useMemo(() => {
    let marksArr = [];
    for (let i = max; i > 0; i -= step) {
      marksArr.push(i);
    }
    return marksArr;
  }, [min, max, step]);

  const mouseEventHandler = e => {
    let elemChild = document.querySelector('.arrow');
    e.stopPropagation();
    const indicatorBarHeight = indicatorRef.current.clientHeight;
    const { top } = e.currentTarget.getBoundingClientRect();
    const calibration = 1.0 / max / 2;
    const percentage =
      (indicatorBarHeight - (e.nativeEvent.clientY - top)) /
        indicatorBarHeight -
      calibration;
    const num = Math.floor(Math.max(percentage, 0) * max) + min;
    elemChild.style.top = e.nativeEvent.clientY - top + 'px';
    if (onChange) onChange(num);
  };

  const handleOnMouseDown = (e) => {
    const indicatorBarHeight = indicatorRef.current.clientHeight;
    let elemParent = document.querySelector('.range-marks');
    let elemChild = document.querySelector('.arrow');
    e.preventDefault();
    e.stopPropagation();
    if (e.target === elemChild) {
      const { top } = elemChild.getBoundingClientRect();
      const disY = e.clientY - top;

      const onMouseMove  = (e) => {
        let t = e.clientY  - disY - top;
        let marginBottom = 8;
        if (t < 0) {
          t = -marginBottom;
        } else if (t > elemParent.offsetHeight - elemChild.offsetHeight) {
          t = elemParent.offsetHeight - elemChild.offsetHeight;
        }
        const calibration = 1.0 / max / 2;
        const percentage =
          (indicatorBarHeight - t - marginBottom) /
            indicatorBarHeight -
          calibration;
        const num = Math.floor(Math.max(percentage, 0) * max) + min;
        elemChild.style.top = t + 'px';
        if (onChange) onChange(num);
      };
      const onMouseUp = e => {
        e.preventDefault();
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      };
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    }
  };

  return (
    <div className="range">
      <div className="range-title">{title}</div>
      <div className="range-label">{max}层</div>
      <div
        ref={indicatorRef}
        className="range-marks"
        style={{ position: 'relative' }}
        onMouseDown={mouseEventHandler}
      >
        {marks.map(index => {
          return (
            <div
              className="mark"
              key={index}
              style={{
                width: '8px',
                height: '1px',
                backgroundColor: index <= value ? '#3F87F5' : '#fff',
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
            top: '160px',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer'
          }}
          onMouseDown={handleOnMouseDown}
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

export default Slider;
