const CT_LUNG_LOBES = {
  subTitle: 'totalLung',
  subMenu: ['R_super_', 'R_middle_', 'R_infer_', 'L_super_', 'L_infer_'],
};

const CT_LUNG_NODULE_LSDS = {
  subTitle: 'totalLung',
  subMenu: ['R_super_', 'R_middle_', 'R_infer_', 'L_super_', 'L_infer_'],
  secondMenu: {
    R_super_: [ '_apical', '_poster', '_anter' ],
    R_middle_: [ '_lateral', '_medial' ], 
    R_infer_: [ '_dorsal', '_medial_basal', '_anter_basal', '_lateral_basal', '_poster_basal' ], 
    L_super_: ['_apicoposter', '_anter', '_super_linguar', '_infer_lingular'], 
    L_infer_: ['_dorsal', '_anter_medial_basal', '_lateral_basal', '_poster_basal'],
  }
};

const tracheaLabelMap = {
  trachea: 1,
  R_main_bronchus: 2,
  R_super_lb_bronchus: 3,
  R_super_lb_apical_bronchus: 4,
  R_super_lb_poster_bronchus: 5,
  R_super_lb_anter_bronchus: 6,
  R_intermedius_bronchus: 7,
  R_middle_lb_bronchus: 8,
  R_middle_lb_lateral_bronchus: 9,
  R_middle_lb_medial_bronchus: 10,
  R_infer_lb_bronchus: 11,
  R_infer_lb_dorsal_bronchus: 12,
  R_infer_lb_basal_bronchus: 13,
  R_infer_lb_medial_basal_bronchus: 14,
  R_infer_lb_anter_basal_bronchus: 15,
  R_infer_lb_lateral_basal_bronchus: 16,
  R_infer_lb_poster_basal_bronchus: 17,
  L_main_bronchus: 18,
  L_super_lb_bronchus: 19,
  L_super_lb_super_bronchus: 20,
  L_super_lb_apicoposter_bronchus: 21,
  L_super_lb_anter_bronchus: 22,
  L_super_lb_linguar_bronchus: 23,
  L_super_lb_super_linguar_bronchus: 24,
  L_super_lb_infer_lingular_bronchus: 25,
  L_infer_lb_bronchus: 26,
  L_infer_lb_dorsal_bronchus: 27,
  L_infer_lb_basal_bronchus: 28,
  L_infer_lb_medial_anter_basal_bronchus: 29,
  L_infer_lb_lateral_basal_bronchus: 30,
  L_infer_lb_poster_basal_bronchus: 31,
};


const CT_LUNG_DATA = {
  lobes: CT_LUNG_LOBES,
  lsds: CT_LUNG_NODULE_LSDS,
}

export {
  CT_LUNG_DATA,
}