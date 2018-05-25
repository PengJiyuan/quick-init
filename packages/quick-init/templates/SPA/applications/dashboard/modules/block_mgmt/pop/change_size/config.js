export default {
  title: ['extend_capacity'],
  fields: [{
    type: 'iconLabel',
    field: 'name',
    icon_type: 'block-storage'
  }, {
    type: 'inputNumber',
    field: 'capacity',
    addonAfter: 'GB',
    decorator: {
      id: 'capacity',
      rules: [{
        required: true,
        message: 'pls_select_size'
      }]
    }
  }, {
    type: 'text',
    field: 'warning',
    info: 'reduce_capacity_warning',
    text_type: 'error',
    hasLabel: false,
    hide: true
  }],
  btn: {
    value: 'extend_capacity',
    type: 'primary',
    disabled: false
  }
};
