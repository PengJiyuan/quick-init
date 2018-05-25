/**
 * 下载文件
 * 兼容火狐
 * @return: Promise
 */
const Promise = require('rsvp').Promise;

function download(url, type, name) {
  try {
    let linkNode = document.createElement('a');
    linkNode.href = url;
    // 如果是图片，需要加download属性
    if(type && type === 'image') {
      linkNode.download = name || 'image';
    }
    // 解决firefox不支持a.click()的问题。
    document.body.appendChild(linkNode);
    linkNode.click();
    document.body.removeChild(linkNode);

    return 'download success!';
  } catch(e) {
    return '';
  }
}

module.exports = (url, type, name) => {
  return new Promise((resolve, reject) => {
    resolve(download(url, type, name));
  });
};
