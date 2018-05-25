import fetch from 'client/libs/fetch';

export default {
  getList() {
    return fetch.get({
      url: '/api/alerta/alert/count'
    });
  },
  modifyPassword(data) {
    return fetch.put({
      url: '/api/password',
      data
    });
  }
};
