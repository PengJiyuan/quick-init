export default {
  title: ['delete', 'volume'],
  fields: [{
    type: 'text',
    field: 'info'
  }, {
    type: 'alertWithClick',
    tip_type: 'warning',
    field: 'clear',
    message: 'sure_to_delete_volume_tip',
    linkText: 'clear_snapshot',
    hide: true
  }],
  btn: {
    value: 'delete',
    type: 'danger',
    disabled: true
  }
};
