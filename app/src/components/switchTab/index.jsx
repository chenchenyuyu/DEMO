import React, { useState } from 'react';

import './index.less';

const SwitchTab = ({ showTab, toggleArrowTab, handleClick }) => {
  const [ focusIndex, setFocusIndex ] = useState(0);
  
  const items = ['lobes', 'lsds'];
  const setActiveIndex = (index) => {
    setFocusIndex(index);
    if (handleClick) handleClick(items[index]);
  }
  return (
    <div className="switch-tab">
      <div className="switch-tab-content">
        <div className="switch-tab-content-btn">
          {
            items.map((item, index) => (
              <div className={focusIndex === index ? 'switch-tab-content-btn-active': ''} onClick={() => setActiveIndex(index)}>{item}</div>
            ))
          }
        </div>
        <div className="switch-tab-content-arrow" onClick={toggleArrowTab}>
          <div className={`switch-tab-content-arrow-icon ${showTab ? 'u-arrow-down' : 'u-arrow-right'}`} />
        </div>
      </div>
    </div>
  )
};

export default SwitchTab;
