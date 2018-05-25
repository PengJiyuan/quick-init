import {ModalV2} from 'ufec';
import config from './config';
import __ from 'client/locale/dashboard.lang.json';
import unit from '../../../../utils/unit';
import request from '../../request';
import getErrorMessage from '../../../../utils/error_message';
import confirmReduceCapacity from '../confirm_reduce_capacity/index';

function pop(obj, callback, flag) {
  config.title = flag ? ['extend_capacity'] : ['reduce_capacity'];
  config.btn.value = flag ? 'extend_capacity' : 'reduce_capacity';

  config.fields[0].text = obj.name;
  config.fields[1].decorator.initialValue = unit.bytesToGB(obj.size);
  config.fields[1].min = flag ? unit.bytesToGB(obj.size) : 0;
  config.fields[1].max = !flag ? unit.bytesToGB(obj.size) : Infinity;
  config.fields[2].hide = flag;

  let props = {
    __: __,
    config: config,
    onConfirm: function(values, cb, closeImmediately) {
      let data = {
        size: values.capacity
      };
      if(!flag) {
        data.allowShrink = '';
      }
      if(!flag) {
        confirmReduceCapacity(obj, data, callback);
      } else {
        request.changeSize(obj.id, data).then(res => {
          cb(true);
          callback && callback();
        }).catch(err => {
          cb(false, getErrorMessage(err));
        });
      }
    }
  };
  ModalV2(props);
}
export default pop;
