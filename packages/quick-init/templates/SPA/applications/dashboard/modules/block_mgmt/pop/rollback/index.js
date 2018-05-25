import {ModalV2} from 'ufec';
import config from './config';
import __ from 'client/locale/dashboard.lang.json';
import request from '../../request';
import getErrorMessage from '../../../../utils/error_message';

function pop(obj, callback) {
  let snaps = [];
  obj.snaps.forEach(snap => {
    snaps.push({
      id: snap.id,
      name: snap.name
    });
  });
  config.fields[0].data = snaps;
  let props = {
    __: __,
    config: config,
    onConfirm: function(values, cb) {
      request.rollback(values.snapshot).then(res => {
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
