import React from 'react';

const Button = ({ style, onClick, children }) => {
  return(
    <div onClick={onClick ? onClick : undefined} style={style}>{children}</div>
  )
};

export default Button;