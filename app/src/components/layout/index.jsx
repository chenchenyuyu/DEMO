import React from 'react';

import './index.less';

const btnStyle = {
  display: 'inline-block',
  height: '20px',
  fontSize: '14px',
  textAlign: 'center',
  lineHeight: '20px',
  backgroundColor: '#6961F4',
  cursor: 'pointer',
  color: '#fff',
  borderRadius: '6px',
  padding: '0 8px',
  boxShadow: '1px 5px 5px #590D88',
};

const Layout = () => {
  return(
    <div className="layout">
      <Button style={btnStyle}>布局按钮</Button>
    </div>
  );
};

export default Layout;