import {ModalV2} from 'ufec';
import config from './config';
import __ from 'client/locale/dashboard.lang.json';
import request from '../../request';
import getErrorMessage from '../../../../utils/error_message';

function pop(obj, data, callback) {
  config.fields[1].message = __.sure_to_reduce_capacity.replace('{0}', data.size);

  let props = {
    __: __,
    config: config,
    onConfirm: function(values, cb, closeImmediately) {
      request.changeSize(obj.id, data).then(res => {
        closeImmediately(() => {
          callback && callback();
        });
      }).catch(err => {
        cb(false, getErrorMessage(err));
      });
    },
    beforeSubmit: function(values, form, trueSubmit) {
      if (values.volume_name !== obj.name) {
        form.setFields({
          volume_name: {
            value: values.volume_name,
            errors: [new Error(__.pls_enter_correct_value)]
          }
        });
      } else {
        trueSubmit();
      }
    }
  };
  ModalV2(props);
}
export default pop;
