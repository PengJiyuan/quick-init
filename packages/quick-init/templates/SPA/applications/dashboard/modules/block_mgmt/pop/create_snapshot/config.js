import regex from '../../../../utils/regex';

export default {
  title: ['create_snapshot'],
  fields: [{
    type: 'iconLabel',
    field: 'volume_name',
    icon_type: 'block-storage'
  }, {
    type: 'input',
    field: 'name',
    placeholder: 'pls_enter_snapshot_name',
    decorator: {
      id: 'name',
      rules: [{
        required: true,
        pattern: regex.nameReg,
        message: 'pls_enter_snapshot_name'
      }]
    }
  }],
  btn: {
    value: 'create',
    type: 'primary'
  }
};
