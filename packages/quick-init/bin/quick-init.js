#!/usr/bin/env node
'use strict';

const path = require('path');
const fs = require('fs-extra');
const spawn = require('cross-spawn');
const chalk = require('chalk');
const program = require('commander');
const inquirer = require('inquirer');
const packageJson = require('../package.json');

let projectName;

program
  .version(packageJson.version, '-v, --version')
  .arguments('<project-directory>')
  .usage(`${chalk.green('<project-directory>')} [options]`)
  .option('--overwrite', 'overwrite the exist path')
  .option('--verbose', 'output verbose info')
  .action(name => {
    projectName = name;
  })
  .parse(process.argv);

if(!projectName) {
  console.error('\nPlease specify project name!\n');
  console.log(
    `eg: ${chalk.cyan(program.name())} ${chalk.green('my-app')}\n`
  );
  process.exit(1);
}

// project init path
const root = path.resolve(projectName);
const rootExist = fs.pathExistsSync(root);

if(rootExist && !program.overwrite) {
  inquirer.prompt({
    type: 'list',
    name: 'overwrite',
    message: `Path ${chalk.yellow(root)} is exist, do you want to overwrite it?`,
    choices: [
      'Exit and Check',
      'OverWrite'
    ]
  }).then(answers => {
    const overwrite = answers.overwrite === 'OverWrite';
    if(overwrite) {
      selectAppType();
    } else {
      process.exit(1);
    }
  });
} else if(!rootExist) {
  selectAppType();
}

function selectAppType() {
  fs.emptyDirSync(root);
  console.log();
  inquirer.prompt({
    type: 'list',
    name: 'type',
    message: `Which type do you want to create?`,
    choices: [
      {
        name: 'react-demo - (build a react demo)',
        value: 'react-demo'
      },
      {
        name: 'SPA - (Single Page Application, use react, react-router, redux)',
        value: 'SPA'
      },
      {
        name: 'MPA - (Multiple entry, for build normal website)',
        value: 'MPA'
      },
      {
        name: 'dashboard',
        value: 'dashboard'
      }
    ]
  }).then(a => {
    createApp(a.type);
  });
}

function install() {

  console.log('Installing packages, This might take a couple of minutes...\n');

  return new Promise((resolve, reject) => {
    const commond = 'npm';
    const args = [
      'install'
    ];

    if(program.verbose) {
      args.push('--verbose');
    }

    spawn(commond, args, { stdio: 'inherit' }).on('close', code => {
      if (code !== 0) {
        reject();
        process.exit(1);
      }
      resolve();
    });
  });
}

function createApp(type) {
  fs.ensureDirSync(root);
  process.chdir(root);

  const scriptPath = path.resolve(
    __dirname,
    '..',
    'scripts',
    'init.js'
  );

  require(scriptPath)(type).then(() => {
    fs.readJson('./package.json').then(obj => {
      obj.name = projectName;
      fs.writeJson('./package.json', obj, {spaces: 2}).then(() => {
        console.log('\nInit package.json success!\n');
        install().then(() => {
          console.log(
            `${chalk.cyan(`${projectName} installed success!`)}\r\n`,
            `${chalk.cyan('You can:\r\n')}`,
            `${chalk.cyan(`  cd ${chalk.green(projectName)}\n`)}`,
            `${chalk.green('  npm start')} to visit this website!\n`
          );
        });
      }).catch(err => {
        console.error(err);
        process.exit(1);
      });
    });
  });
}
