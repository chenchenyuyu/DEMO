import React, { useState, useRef, useEffect } from 'react';
import { Checkbox } from 'antd';

import './index.less';

/* eslint-disable react/prop-types */

const CheckboxGroup = Checkbox.Group;

const SecCheckboxGroup = ({ isCheckAll, defaultCheckedList, secTitle, onChange, setSecIndeterminate }) => {
  const [checkedList, setCheckedList] = useState(defaultCheckedList.map((lsds) =>`${secTitle}lb${lsds}`));
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(true);
  useEffect(() => {
    const arr = defaultCheckedList.map((lsds) => {
      return `${secTitle}lb${lsds}`
    })
    const checkedVal = isCheckAll ? arr : [];
    setCheckedList(checkedVal);
    setIndeterminate(false);
    setSecIndeterminate(false);
    setCheckAll(isCheckAll);
    // if(onChange) onChange(checkedVal);
  }, [isCheckAll]);

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
  const onCheckAllChange = (e, secTitle) => {
    const arr = defaultCheckedList.map((lsds) => {
      return `${secTitle}lb${lsds}`
    })
    const checkedVal = e.target.checked ? arr : [];

    setCheckedList(checkedVal);
    setIndeterminate(false);
    setSecIndeterminate(false);
    setCheckAll(e.target.checked);
    if(onChange) onChange(checkedVal);
  };

  const handleSecChange = (checkedList, options, secTitle) => {
    
    const val = !!checkedList.length && checkedList.length < options.length;
    setCheckedList(checkedList);

    setIndeterminate(val);
    setSecIndeterminate(val);
    setCheckAll(checkedList.length === options.length);
    if(onChange) onChange(checkedList);
  }

  return (
    <>
      <Checkbox
      indeterminate={indeterminate}
      onChange={(e) => onCheckAllChange(e, secTitle)}
      checked={checkAll}
      >
      {secTitle}
      </Checkbox>
      <CheckboxGroup
        options={getOptions(defaultCheckedList, secTitle, 'lb')}
        value={checkedList}
        onChange={(checkedList) => handleSecChange(checkedList, getOptions(defaultCheckedList), secTitle)}
      />
    </>
  )
};


const CustomCheckboxGroup = ({ defaultCheckedList, onChange }) => {
  const { subTitle = '', subMenu = [], secondMenu = {} } = defaultCheckedList || {};
  const [checkedList, setCheckedList] = useState(subMenu);
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(true);
  console.log('全选checkAll', checkAll)
  // 二级checkbox
  const [secCheckedList, setSecCheckedList] = useState(null);
  const [secIndeterminate, setSecIndeterminate] = useState(false);

  // useEffect(() => {
  //   if (secCheckedList) {
  //     setIndeterminate((secCheckedList.length === 0 || secIndeterminate));
  //   }
  // }, [secCheckedList, secIndeterminate]);

  const getOptions = (options) => {
    return [
      ...options.map((lobe) => {
        return {
          label: lobe,
          value: lobe,
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

  const onCheckAllChange = (e) => {
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
                <SecCheckboxGroup isCheckAll={checkAll} defaultCheckedList={secondMenuArr} secTitle={secTitle} onChange={(list) => setSecCheckedList(list)} setSecIndeterminate={(bool) => setSecIndeterminate(bool)}/>
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
