import React from 'react';
import intl from 'react-intl-universal';
import { ratingMap } from './map';

import './index.less';

const Rating = ({ style, data, value, onChange }) => {

  const handleClick = () => {
    const currentIndex = (value < Math.max(...data)) ? (data.indexOf(value) + 1) : 0;
    onChange(data[currentIndex]);
  };

  const findKey = (obj, value, compare = (a, b) => a === b) => {
    return Object.keys(obj).find(k => compare(obj[k], value));
  };

  return(
    <div className="rating" style={style} onClick={handleClick}>
      <div className="rating-cicle" style={{ opacity: value}}/>
      <div className="rating-text">
        {intl.get(findKey(ratingMap, value))}
      </div>
    </div>
  );
};

export default Rating;
