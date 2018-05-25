import {ModalV2} from 'ufec';
import config from './config';
import __ from 'client/locale/dashboard.lang.json';
import object_size from './object_size';
import request from '../../request';
import getErrorMessage from '../../../../utils/error_message';

function pop(pools, currentPool, callback) {
  const poolList = [];
  pools.forEach(pool => {
    poolList.push({
      id: pool.pool_name,
      name: pool.pool_name
    });
  });
  config.fields[0].data = poolList;
  config.fields[0].decorator.initialValue = currentPool;
  const objectSize = object_size;
  config.fields[4].data = objectSize;
  config.fields[5].data = [];
  let props = {
    __: __,
    config: config,
    onConfirm: function(values, cb, closeImmediately) {
      let data = {
        image: values.name,
        pool: values.pool,
        size: values.capacity
      };
      // 高级选项没打开
      if(!values.expand || values.expand.length < 1) {
        request.createVolume(data).then(res => {
          cb(true);
          callback && callback();
        }).catch(err => {
          cb(false, getErrorMessage(err));
        });
      } else if(values.expand && values.expand.length > 0) {
        // 高级选项打开
        data.objectSize = values.object_size;
        data.stripeUnit = values.stripe_unit;
        data.stripeCount = values.stripe_count;
        request.createVolume(data).then(res => {
          cb(true);
          callback && callback();
        }).catch(err => {
          cb(false, getErrorMessage(err));
        });
      }
    },
    onAction: function(field, value, form, updateFields) {
      const copyObjectSize = JSON.parse(JSON.stringify(objectSize));
      const valueOS = form.getFieldValue('object_size');
      const valueSU = form.getFieldValue('stripe_unit');
      const updateStripeCount = (value1, value2) => {
        updateFields({
          stripe_count: {
            placeholder: value1 === value2 ? '1' : '1 - 16',
            disabled: !(value1 && value2)
          }
        });
      };
      switch (field) {
        case 'object_size':
          updateFields({
            stripe_unit: {
              data: copyObjectSize.slice(0, copyObjectSize.findIndex(size => size.id === value) + 1)
            }
          });
          // 如果选择的值比下级小，重置条带化大小的值
          if(copyObjectSize.findIndex(size => size.id === value) < copyObjectSize.findIndex(size => size.id === valueSU)) {
            form.setFields({
              stripe_unit: {
                value: undefined
              }
            });
          }
          updateStripeCount(value, valueSU);
          break;
        case 'stripe_unit':
          updateStripeCount(valueOS, value);
          break;
        default:
          break;
      }
    }
  };
  ModalV2(props);
}
export default pop;
