export default {
  title: ['reduce_capacity'],
  fields: [{
    type: 'input',
    field: 'volume_name',
    placeholder: 'pls_enter_block_storage_name',
    decorator: {
      id: 'volume_name',
      rules: [{
        required: true,
        message: 'pls_enter_block_storage_name'
      }]
    }
  }, {
    type: 'alert',
    field: 'info',
    tip_type: 'warning'
  }],
  btn: {
    value: 'reduce_capacity',
    type: 'primary'
  }
};
