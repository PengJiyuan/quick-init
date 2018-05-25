export default {
  title: ['rollback'],
  fields: [{
    type: 'select',
    field: 'snapshot',
    placeholder: 'pls_select_snapshot',
    data: [],
    decorator: {
      id: 'snapshot',
      rules: [{
        required: true,
        message: 'pls_select_snapshot'
      }]
    }
  }],
  btn: {
    value: 'confirm',
    type: 'primary'
  }
};
