import React, { useState } from 'react';
import Slider from '../../components/slider/index';

import './index.less';

const Com = () => {
  const [ mipSize, setMipSize ] = useState(1);
  return (
    <div className="com" style={{ color: '#fff' }}>
      <h2 style={{ textAlign: 'center', color: '#fff' }}>组件</h2>
      <div className="content" style={{ textAlign: 'center' }}>
      <Slider value={mipSize} min={1} max={20} step={1} title={'MinIP'} onChange={(value) => setMipSize(value)} />
      </div>
    </div>
  );
};

export default Com;
