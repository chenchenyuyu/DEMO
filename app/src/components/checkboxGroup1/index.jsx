import React from 'react';
import intl from 'react-intl-universal';
import { Checkbox } from 'antd';

import './index.less';

/* eslint-disable react/prop-types */

const Group = ({ title, indeterminate, checked, onChange, children }) => {
  return (
    <div className="site-checkbox-all-group">
      <Checkbox
        indeterminate={indeterminate}
        onChange={onChange}
        checked={checked}>
        {intl.get(title)}
      </Checkbox>
      {children}
    </div>
  );
};

const lungLobes = [
  'rightLungUpperLobe',
  'rightLungMiddleLobe',
  'rightLungLowerLobe',
  'leftLungUpperLobe',
  'leftLungLowerLobe',
];

const LungLobeCheckboxGroup = ({ value, onChange, direction }) => {
  return (
    <div className="custom-checkbox-group">
      <Group
        title="totalLung"
        indeterminate={value.length > 0 && value.length < lungLobes.length}
        checked={value.length === lungLobes.length}
        onChange={(e) => onChange(e.target.checked ? lungLobes : [])}>
        <Checkbox.Group
          className={direction === 'horizontal' ? 'horizontal' : 'vertical'}
          options={lungLobes.map((key) => ({ label: intl.get(key), value: key }))}
          value={value}
          onChange={onChange} />
      </Group>
    </div>
  );
};

const lungLobeSegmentsMap = {
  rightLungUpperLobe: [ 'R_super_lb_apical', 'R_super_lb_poster', 'R_super_lb_anter' ],
  rightLungMiddleLobe: [ 'R_middle_lb_lateral', 'R_middle_lb_medial' ],
  rightLungLowerLobe: [ 'R_infer_lb_dorsal', 'R_infer_lb_medial_basal', 'R_infer_lb_anter_basal', 'R_infer_lb_lateral_basal', 'R_infer_lb_poster_basal' ],
  leftLungUpperLobe: ['L_super_lb_apicoposter', 'L_super_lb_anter', 'L_super_lb_super_linguar', 'L_super_lb_infer_lingular'],
  leftLungLowerLobe: ['L_infer_lb_dorsal', 'L_infer_lb_anter_medial_basal', 'L_infer_lb_lateral_basal', 'L_infer_lb_poster_basal'],
};

const lungSegments = Object.values(lungLobeSegmentsMap).reduce((a, b) => [...a, ...b], []);

const LungSegmentCheckboxGroup = ({ value, onChange }) => {
  return (
    <div className="custom-checkbox-group">
      <Group
        title="totalLung"
        indeterminate={value.length > 0 && value.length < lungSegments.length}
        checked={value.length === lungSegments.length}
        onChange={(e) => onChange(e.target.checked ? lungSegments : [])}>
        {Object.entries(lungLobeSegmentsMap).map(([lobe, segments]) => {
          const currentVisibleSegments = value.filter((visibleSegment) => segments.includes(visibleSegment));
          const otherSegments = value.filter((visibleSegment) => !segments.includes(visibleSegment));
          return (
            <Group
              key={lobe}
              title={lobe}
              indeterminate={currentVisibleSegments.length > 0 && currentVisibleSegments.length < segments.length}
              checked={currentVisibleSegments.length === segments.length}
              onChange={(e) => onChange(e.target.checked ? [ ...otherSegments, ...segments ] : otherSegments)}>
              <Checkbox.Group
                options={segments.map((key) => ({ label: intl.get('_' + key.split('_lb_')[1]), value: key }))}
                value={currentVisibleSegments}
                onChange={(visibleSegments) => onChange([ ...otherSegments, ...visibleSegments ])} />
            </Group>
          );
        })}
      </Group>
    </div>
  );
};

export { lungLobes, lungLobeSegmentsMap };

export { LungLobeCheckboxGroup, LungSegmentCheckboxGroup };

