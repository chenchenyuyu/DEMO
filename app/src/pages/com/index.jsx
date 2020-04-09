import React from 'react';
import Range from '../../components/range/index';

import './index.less';

const Com = () => {
  return (
    <div className="com" style={{ color: '#fff' }}>
      <h2 style={{ textAlign: 'center', color: '#fff' }}>组件</h2>
      <div className="content" style={{ textAlign: 'center' }}>
        <Range />
      </div>
    </div>
  );
};

export default Com;
