import React, { useState } from 'react';
import intl from 'react-intl-universal';
import { ratingMap } from './ratingMap';

import './index.less';

const findKey = (obj, value, compare = (a, b) => a === b) => {
  return Object.keys(obj).find(k => compare(obj[k], value));
};

const Rating = ({ style, data, value, onChange }) => {
  const [ showUp, setShowUp ] = useState(true);
  const [ showDown, setShowDown ] = useState(true);
  const [ showArrow, setShowArrow ] = useState(false);

  const handleUpClick = () => {   
    if (value < Math.max(...data)) {
      onChange(data[data.indexOf(value) + 1]);
    } else {
      setShowUp(false);
      setShowDown(true);
    }
  };

  const handleDownClick = () => {
    if (value <= Math.max(...data) && value > Math.min(...data)) {
      onChange(data[data.indexOf(value) - 1]);
    } else {
      setShowDown(false);
      setShowUp(true);
    }
  };

  return(
    <div className="rating" style={style} onMouseOver={() => setShowArrow(true)} onMouseLeave={() => setShowArrow(false)}>
      <div className="rating-cicle" style={{ opacity: value}}/>
      <div className="rating-text">
        {intl.get(findKey(ratingMap, value))}
      </div>
      {
        showArrow &&
        <div className="rating-arrow">
          <div className={ showUp ? 'rating-arrow-up' : 'rating-arrow-up-disable'} onClick={ showUp ? handleUpClick : {}}/>
          <div className={ showDown ? 'rating-arrow-down' : 'rating-arrow-down-disable'} onClick={ showDown ? handleDownClick : {}} />
        </div>
      }
    </div>
  );
};

export default Rating;