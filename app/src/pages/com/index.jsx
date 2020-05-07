import React, { useState, useEffect } from 'react';
import Slider from '../../components/slider/index';
import SwitchTab from '../../components/switchTab/index';
import CheckboxGroup from '../../components/checkboxGroup/index';
import { CT_LUNG_DATA } from '../../components/checkboxGroup/data';

import './index.less';

const Com = () => {
  const items = ['lobes', 'lsds'];
  const [ mipSize, setMipSize ] = useState(1);
  const [ checkboxList, setCheckboxList ] = useState(CT_LUNG_DATA['lobes'].subMenu);
  const [ showTab0, setShowTab0 ] = useState(true);
  const [ showTab, setShowTab ] = useState(true);
  const [ activeTab, setActiveTab ] = useState(items[0]);
  // 选择了肺叶还是肺段
  // 肺叶肺段选择
  console.log('activeTab', activeTab)
  return (
    <div className="com" style={{ color: '#fff' }}>
      <h2 style={{ textAlign: 'center', color: '#fff' }}>组件</h2>
      <div className="content" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
        <div>
          <SwitchTab showTab={showTab0} toggleArrowTab={() => setShowTab0(!showTab0)}/>
        </div>
        <div>
        <SwitchTab showTab={showTab} toggleArrowTab={() => setShowTab(!showTab)} handleClick={(activeTab) => setActiveTab(activeTab)}/>
        {showTab &&
        <CheckboxGroup onChange={(lists) => setCheckboxList(lists)} defaultCheckedList={CT_LUNG_DATA[activeTab]}/>
        }
         {/* {showTab &&
        <CheckboxGroup onChange={(lists) => setCheckboxList(lists)} defaultCheckedList={CT_LUNG_DATA['lsds']}/>
        } */}
        </div>
        <Slider value={mipSize} min={1} max={20} step={1} title={'MinIP'} onChange={(value) => setMipSize(value)} />
      </div>
    </div>
  );
};

export default Com;
