import regex from '../../../../utils/regex';

export default {
  title: ['create_block_volume'],
  fields: [{
    type: 'select',
    field: 'pool',
    placeholder: 'pls_select_pool',
    decorator: {
      id: 'pool',
      rules: [{
        required: true,
        message: 'pls_select_pool'
      }]
    }
  }, {
    type: 'input',
    field: 'name',
    placeholder: 'pls_enter_block_storage_name',
    decorator: {
      id: 'name',
      rules: [{
        required: true,
        message: 'pls_enter_block_storage_name'
      }]
    }
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
    type: 'checkbox',
    field: 'expand',
    decorator: {
      id: 'expand'
    },
    linkList: [{
      id: 'object_size',
      hide: value => !( value.length > 0 )
    }, {
      id: 'stripe_unit',
      hide: value => !( value.length > 0 )
    }, {
      id: 'stripe_count',
      hide: value => !( value.length > 0 )
    }],
    data: [{
      label: 'show_advanced_options',
      value: 'show_advanced_options'
    }]
  }, {
    type: 'select',
    field: 'object_size',
    placeholder: 'pls_select_size',
    decorator: {
      id: 'object_size',
      rules: [{
        required: true,
        message: 'pls_select_an_option'
      }]
    },
    hide: true
  }, {
    type: 'select',
    field: 'stripe_unit',
    placeholder: 'pls_select_size',
    decorator: {
      id: 'stripe_unit',
      rules: [{
        required: true,
        message: 'pls_select_an_option'
      }]
    },
    hide: true
  }, {
    type: 'input',
    field: 'stripe_count',
    placeholder: '1  ~  16',
    decorator: {
      id: 'stripe_count',
      rules: [{
        required: true,
        pattern: regex.isNumber,
        message: 'pls_enter_correct_value'
      }]
    },
    hide: true,
    disabled: true
  }],
  btn: {
    value: 'create',
    type: 'primary'
  }
};
