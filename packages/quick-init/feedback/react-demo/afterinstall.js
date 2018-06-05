const chalk = require('chalk');

module.exports = projectName => {
  console.log(
    `${chalk.cyan(`${projectName} installed success!`)}\r\n`,
    `${chalk.cyan('You can:\r\n')}`,
    `${chalk.cyan(`  cd ${chalk.green(projectName)}\n`)}`,
    `${chalk.green('  npm start')} to visit this website on \`localhost:8888\`!\n`
  );
};
