import fetch from 'client/libs/fetch';

import config from './config.json';
const limit = config.table.limit;

export default {
  getList: function(pool, page) {
    let p = page ? page : 1;
    return fetch.get({
      url: `/api/rbd/image?pool=${pool}&page=${p}&limit=${limit}`
    });
  },
  getListById: function(id) {
    return fetch.get({
      url: `/api/rbd/image/${id}`
    });
  },
  getPoolList: function(type) {
    return fetch.get({
      url: `/api/pool?limit=0&type=${type}`
    });
  },
  createVolume: function(data) {
    return fetch.post({
      url: '/api/rbd/image',
      data: data
    });
  },
  createSnapshot: function(imageID, snapshotName) {
    return fetch.post({
      url: `/api/rbd/image/${imageID}/snap`,
      data: {
        snap: snapshotName
      }
    });
  },
  clearSnapshot: function(imageID) {
    return fetch.delete({
      url: `/api/rbd/image/${imageID}/snap`
    });
  },
  flatten: function(imageID) {
    return fetch.post({
      url: `/api/rbd/image/${imageID}/flatten`
    });
  },
  changeSize: function(imageID, data) {
    return fetch.put({
      url: `/api/rbd/image/${imageID}/size`,
      data: data
    });
  },
  rollback: function(snapID) {
    return fetch.post({
      url: `/api/rbd/snap/${snapID}/rollback`
    });
  },
  deleteVolume: function(imageID) {
    return fetch.delete({
      url: `/api/rbd/image/${imageID}`
    });
  },
  getSnapshotById: function(snapshotId) {
    return fetch.get({
      url: `/api/rbd/snap/${snapshotId}`
    });
  }
};