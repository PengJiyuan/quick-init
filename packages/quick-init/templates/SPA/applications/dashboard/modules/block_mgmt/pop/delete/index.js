import {ModalV2} from 'ufec';
import config from './config';
import __ from 'client/locale/dashboard.lang.json';
import {ModalAlert} from 'ufec';
import request from '../../request';
import getErrorMessage from '../../../../utils/error_message';

function pop(obj, callback) {
  config.fields[0].hide = obj.snaps && obj.snaps.length > 0;
  config.fields[0].info = __.sure_to_delete_volume.replace('{0}', obj.name);
  config.fields[1].hide = !(obj.snaps && obj.snaps.length > 0);
  config.btn.disabled = obj.snaps && obj.snaps.length > 0;
  let props = {
    __: __,
    config: config,
    onConfirm: function(values, cb) {
      request.deleteVolume(obj.id).then(res => {
        cb(true);
        callback && callback();
      }).catch(err => {
        cb(false, getErrorMessage(err));
      });
    },
    onAction: function(field, value, form, updateFields, setBtnDisabled) {
      switch (field) {
        case 'clear':
          ModalAlert({
            __: __,
            title: ['clear_snapshot'],
            info: __.sure_to_clear_snapshot.replace('{0}', obj.name),
            message: __.sure_to_clear_snapshot_tip.replace('{0}', obj.name),
            btnValue: 'clear',
            onAction: (cb) => {
              request.clearSnapshot(obj.id).then(res => {
                callback && callback();
                cb(true);
                updateFields({
                  clear: {
                    hide: true
                  },
                  info: {
                    hide: false
                  }
                });
                setBtnDisabled(false);
              }).catch(err => {
                cb(false, getErrorMessage(err));
              });
            }
          });
          break;
        default:
          break;
      }
    }
  };

  ModalV2(props);
}

export default pop;
