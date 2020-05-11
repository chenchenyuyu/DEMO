import React, { useState, useEffect } from 'react';
import Slider from '../../components/slider/index';
import SwitchTab from '../../components/switchTab/index';
import CheckboxGroup from '../../components/checkboxGroup/index';
import { CT_LUNG_DATA } from '../../components/checkboxGroup/data';

import './index.less';

const items = ['lobes', 'lsds'];

let lsdsMap =  {
  R_super_: [ 'R_super_lb_apical', 'R_super_lb_poster', 'R_super_lb_anter' ],
  R_middle_: [ 'R_middle_lb_lateral', 'R_middle_lb_medial' ],
  R_infer_: [ 'R_infer_lb_dorsal', 'R_infer_lb_medial_basal', 'R_infer_lb_anter_basal', 'R_infer_lb_lateral_basal', 'R_infer_lb_poster_basal' ], 
  L_super_: ['L_super_lb_apicoposter', 'L_super_lb_anter', 'L_super_lb_super_linguar', 'L_super_lb_infer_lingular'], 
  L_infer_: ['L_infer_lb_dorsal', 'L_infer_lb_anter_medial_basal', 'L_infer_lb_lateral_basal', 'L_infer_lb_poster_basal'],
};

const lsdsColor = {
  R_super_lb_apical: '#CF2C7D',
  R_super_lb_poster: '#AF50FF',
  R_super_lb_anter: '#FF95F7',
  R_middle_lb_lateral: '#FF9B00',
  R_middle_lb_medial: '#FEFF00',
  R_infer_lb_dorsal: '#005BD0',
  R_infer_lb_medial_basal: '#5793FF',
  R_infer_lb_anter_basal: '#49FF82',
  R_infer_lb_lateral_basal: '#83FFF6',
  R_infer_lb_poster_basal: '#00FFF8',
  L_super_lb_apicoposter: '#9E0961',
  L_super_lb_anter: '#CF2C7D',
  L_super_lb_super_linguar: '#F961CB',
  L_super_lb_infer_lingular: '#DEA0FF',
  L_infer_lb_dorsal: '#83FFF6',
  L_infer_lb_anter_medial_basal: '#00FFF8',
  L_infer_lb_lateral_basal: '#00BCFF',
  L_infer_lb_poster_basal: '#005BD0',
};

const Com = () => {
  const [ mipSize, setMipSize ] = useState(1);
  const [ checkboxList, setCheckboxList ] = useState(lsdsMap);
  const [ checkboxList0, setCheckboxList0 ] = useState(CT_LUNG_DATA.lobes.subMenu);
  const [ showTab0, setShowTab0 ] = useState(true);
  const [ showTab, setShowTab ] = useState(true);
  const [ activeTab, setActiveTab ] = useState(items[0]);
 
  const handleSwitchTab = (activeTab) => {
    setActiveTab(activeTab);
    if (activeTab === 'lsds') {
      setCheckboxList(lsdsMap);
    } else {
      setCheckboxList0(CT_LUNG_DATA.lobes.subMenu);
    }
  }

  return (
    <div className="com" style={{ color: '#fff' }}>
      <h2 style={{ textAlign: 'center', color: '#fff' }}>组件</h2>
      <div className="content" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
        <div>
          <SwitchTab showTab={showTab0} toggleArrowTab={() => setShowTab0(!showTab0)}/>
        </div>
        <div>
        <SwitchTab showTab={showTab} toggleArrowTab={() => setShowTab(!showTab)} handleClick={(activeTab) => handleSwitchTab(activeTab)}/>
        {showTab && activeTab === 'lobes' &&
        <CheckboxGroup onChange={(lists) => setCheckboxList0(lists)} defaultCheckedList={CT_LUNG_DATA['lobes']}/>
        }
         {showTab && activeTab === 'lsds' &&
        <CheckboxGroup checkboxListProp={checkboxList} onSecChange={(lists) => setCheckboxList(lists)} defaultCheckedList={CT_LUNG_DATA['lsds']}/>
        }
        </div>
        <Slider value={mipSize} min={1} max={20} step={1} title={'MinIP'} onChange={(value) => setMipSize(value)} />
      </div>
    </div>
  );
};

export default Com;
