const moment = require('client/libs/moment');

function getTime(time, fromNow, formatter) {
  let uniformTime = time.replace('.000000', 'Z'),
    _formatter = formatter || 'YYYY-MM-DD HH:mm:ss';

  if(fromNow) {
    return moment(uniformTime).fromNow();
  } else {
    return moment(uniformTime).format(_formatter);
  }
}

module.exports = getTime;
