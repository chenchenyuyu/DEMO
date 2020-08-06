import * as THREE from 'three';
import React from 'react';

const Material = ({ type: MaterialType, ...props }) => {
  return(
    <MaterialType
      attach="material"
      color="0xff0000"
      transparent={true}
      opacity={0.5}
      {...props}
    />
  )
};

export default Material;
