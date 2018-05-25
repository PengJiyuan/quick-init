const path = require('path');
const fs = require('fs-extra');

module.exports = (type) => {
  const templatePath = path.resolve(__dirname, '..', `templates/${type}`);
  const CWD = process.cwd();
  return new Promise((resolve, reject) => {
    fs.copy(templatePath, `${CWD}`, {overwrite: true}, (err) => {
      if (err) {
        reject(err);
        process.exit(1);
      }
      console.log('\nInit template success!\n');
      resolve();
    });
  });
};
