import React, { useState } from 'react';
import { Checkbox } from 'antd';

import './index.less';

/* eslint-disable react/prop-types */

const CheckboxGroup = Checkbox.Group;

const CustomCheckboxGroup = ({ defaultCheckedList, onChange }) => {
  const { subTitle = '', subMenu = [], secondMenu = {} } = defaultCheckedList || {};
  const [checkedList, setCheckedList] = useState(subMenu);
  const [secCheckedList, setSecCheckedList] = useState([]);
  // const [R_super_secCheckedList, set_R_super_secCheckedList] = useState([]);
  // const [R_middle_secCheckedList, set_R_middle_secCheckedList] = useState([]);
  // const [R_infer_secCheckedList, set_R_infer_secCheckedList] = useState([]);
  // const [L_super_secCheckedList, set_L_super_secCheckedList] = useState([]);
  // const [L_infer_secCheckedList, set_L_infer_secCheckedList] = useState([]);
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(true);

  const getOptions = (options, secTitle, delimiter) => {
    return [
      ...options.map((lobe) => {
        return {
          label: lobe,
          value: secTitle ? `${secTitle}${delimiter}${lobe}` : lobe,
        };
      })
    ];
  };

  const plainOptions = getOptions(subMenu);

  const handleChange = checkedList => {
    const val = !!checkedList.length && checkedList.length < plainOptions.length;
    setCheckedList(checkedList);
    setIndeterminate(val);
    setCheckAll(checkedList.length === plainOptions.length);
    if(onChange) onChange(checkedList);
  };

  const handleSecChange = (secCheckedList, options) => {
    const val = !!secCheckedList.length && secCheckedList.length < options.length;
    setSecCheckedList(secCheckedList);
    console.log('secCheckedList', secCheckedList)
    console.log('options', options)
    // setIndeterminate(val);
    // setCheckAll(secCheckedList.length === options.length);
    // if(onChange) onChange(secCheckedList);
  }

  const onCheckAllChange = (e, secTitle) => {
    console.log('全选e', secTitle, e)

    const checkedVal = e.target.checked ? subMenu : [];
    setCheckedList(checkedVal);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
    if(onChange) onChange(checkedVal);
  };
  
  return (
    <div className="custom-checkbox-group" >
      <div className="site-checkbox-all-wrapper">
        <Checkbox
          indeterminate={indeterminate}
          onChange={onCheckAllChange}
          checked={checkAll}
        >
          {subTitle}
        </Checkbox>
      </div>
      {
        Object.values(secondMenu).length > 0 ?
        <div className="site-checkbox-all-group-wrapper">
          {
            Object.entries(secondMenu).map(([ secTitle, secondMenuArr]) => (
              <div className="site-checkbox-all-group" key={secTitle}>
              <Checkbox
                indeterminate={indeterminate}
                onChange={(e) => onCheckAllChange(e, secTitle)}
                checked={checkAll}
              >
                {secTitle}
              </Checkbox>
            <CheckboxGroup
              options={getOptions(secondMenuArr, secTitle, 'lb')}
              value={secCheckedList}
              onChange={(secCheckedList) => handleSecChange(secCheckedList, getOptions(secondMenuArr))}
            />
            </div>
            ))
          }
      </div> :
      <div style={{paddingLeft: '12px'}}>
          <CheckboxGroup
          options={plainOptions}
          value={checkedList}
          onChange={handleChange}
        /> 
      </div>
    }
    </div>
  );
};


export default CustomCheckboxGroup;
