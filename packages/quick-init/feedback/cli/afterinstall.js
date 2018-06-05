const chalk = require('chalk');
const spawn = require('cross-spawn');

function link() {
  console.log('\nLink package by npm link...\n');

  return new Promise((resolve, reject) => {
    const commond = 'npm';
    const args = [
      'link'
    ];

    spawn(commond, args, { stdio: 'inherit' }).on('close', code => {
      if (code !== 0) {
        reject();
        process.exit(1);
      }
      resolve();
    });
  });
}

module.exports = projectName => {
  link().then(() => {
    console.log(
      `${chalk.cyan(`${projectName} installed success!`)}\r\n`,
      `${chalk.cyan('You can:\r\n')}`,
      `${chalk.green(` ${projectName} --help`)} to see the options!\n`
    );
  });
};
