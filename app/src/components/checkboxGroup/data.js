const CT_LUNG_LOBES = {
  subTitle: 'totalLung',
  subMenu: ['R_super_', 'R_middle_', 'R_infer_', 'L_super_', 'L_infer_'],
};

const CT_LUNG_NODULE_LSDS = {
  subTitle: 'totalLung',
  subMenu: ['R_super_222', 'R_middle_', 'R_infer_', 'L_super_', 'L_infer_'],
  secondMenu: {
    R_super_: [ '_apical', '_poster', '_anter' ],
    R_middle_: [ '_lateral', '_medial' ], 
    R_infer_: [ '_dorsal', '_medial_basal', '_anter_basal', '_lateral_basal', '_poster_basal' ], 
    L_super_: ['_apicoposter', '_anter', '_super_linguar', '_infer_lingular'], 
    L_infer_: ['_dorsal', '_anter_medial_basal', '_lateral_basal', '_poster_basal'],
  }
};

const CT_LUNG_DATA = {
  lobes: CT_LUNG_LOBES,
  lsds: CT_LUNG_NODULE_LSDS,
}

export {
  CT_LUNG_DATA,
}