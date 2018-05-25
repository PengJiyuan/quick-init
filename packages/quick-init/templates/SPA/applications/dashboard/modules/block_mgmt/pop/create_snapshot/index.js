import {ModalV2} from 'ufec';
import config from './config';
import __ from 'client/locale/dashboard.lang.json';
import request from '../../request';
import getErrorMessage from '../../../../utils/error_message';

function pop(obj, callback) {
  config.fields[0].text = obj.name;
  let props = {
    __: __,
    config: config,
    onConfirm: function(values, cb, closeImmediately) {
      const name = values.name;
      request.createSnapshot(obj.id, name).then(res => {
        cb(true);
        callback && callback();
      }).catch(err => {
        cb(false, getErrorMessage(err));
      });
    }
  };

  ModalV2(props);
}

export default pop;
