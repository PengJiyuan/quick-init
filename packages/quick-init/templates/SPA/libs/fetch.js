import request from 'client/libs/ajax';

let fetch = {};

['get', 'post', 'put', 'delete', 'patch', 'head'].forEach((m) => {
  fetch[m] = function(options) {
    let opt = Object.assign({
      dataType: 'json',
      contentType: 'application/json',
      headers: {}
    }, options);

    return request[m](opt);
  };
});

export default fetch;
