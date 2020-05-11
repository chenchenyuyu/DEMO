import React, { useState, useRef, useEffect } from 'react';
import { Checkbox } from 'antd';

import './index.less';

/* eslint-disable react/prop-types */

const CheckboxGroup = Checkbox.Group;

let lsdsMap =  {
  R_super_: [ 'R_super_lb_apical', 'R_super_lb_poster', 'R_super_lb_anter' ],
  R_middle_: [ 'R_middle_lb_lateral', 'R_middle_lb_medial' ],
  R_infer_: [ 'R_infer_lb_dorsal', 'R_infer_lb_medial_basal', 'R_infer_lb_anter_basal', 'R_infer_lb_lateral_basal', 'R_infer_lb_poster_basal' ], 
  L_super_: ['L_super_lb_apicoposter', 'L_super_lb_anter', 'L_super_lb_super_linguar', 'L_super_lb_infer_lingular'], 
  L_infer_: ['L_infer_lb_dorsal', 'L_infer_lb_anter_medial_basal', 'L_infer_lb_lateral_basal', 'L_infer_lb_poster_basal'],
};

const SecCheckboxGroup = ({ checkboxListProp, isCheckAll, defaultCheckedList, secTitle, onSecChange, setSecIndeterminate }) => {
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
    if(onSecChange) onSecChange(isCheckAll ? lsdsMap : {});
  }, [isCheckAll]);

  const getCheckedListObject = (obj, key, value) => {
    const clone = Object.assign({}, obj);
    clone[key] = value;
    return clone;
  }

  const getOptions = (options, secTitle, delimiter) => {
    return [
      ...options.map((lsds) => {
        return {
          label: lsds,
          value: secTitle ? `${secTitle}${delimiter}${lsds}` : lsds,
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
    // if (onChange) onChange(checkedVal);
    // if(onChange) onChange(getCheckedListObject(secTitle,checkedVal));
    if (onSecChange) onSecChange(getCheckedListObject(checkboxListProp, secTitle, checkedVal));

  };

  const handleSecChange = (checkedList, options, secTitle) => {
    
    const val = !!checkedList.length && checkedList.length < options.length;
    setCheckedList(checkedList);

    setIndeterminate(val);
    setSecIndeterminate(val);
    setCheckAll(checkedList.length === options.length);
    // if (onChange) onChange(checkedList);
    if(onSecChange) onSecChange(getCheckedListObject(checkboxListProp, secTitle, checkedList));
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

const CustomCheckboxGroup = ({ checkboxListProp, defaultCheckedList, onChange, onSecChange }) => {
  const { subTitle = '', subMenu = [], secondMenu = {} } = defaultCheckedList || {};
  const [checkedList, setCheckedList] = useState(subMenu);
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(true);
  
  // 二级checkbox
  const [secCheckedList, setSecCheckedList] = useState(null);
  const [secIndeterminate, setSecIndeterminate] = useState(false);

  const getCheckedListObject = (obj, key, value) => {
    obj[key] = value;
    return obj;
  }

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
    setIndeterminate(false);
    setCheckAll(e.target.checked);
    if (Object.values(secondMenu).length > 0) {
      const checkedVal = e.target.checked ? lsdsMap : {};
      if (onSecChange) onSecChange(checkedVal);
    } else {
      const checkedVal = e.target.checked ? subMenu : [];
      setCheckedList(checkedVal);
      if(onChange) onChange(checkedVal);
    }
  };
  
  return (
    <div className="custom-checkbox-group" >
      <div className="site-checkbox-all-wrapper">
        <Checkbox
          indeterminate={indeterminate || (checkboxListProp && Object.values(checkboxListProp).reduce((prev, cur) => prev + cur.length, 0) < 18)}
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
                <SecCheckboxGroup checkboxListProp={checkboxListProp} isCheckAll={checkAll} defaultCheckedList={secondMenuArr} secTitle={secTitle} onSecChange={onSecChange} setSecIndeterminate={(bool) => setSecIndeterminate(bool)}/>
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
