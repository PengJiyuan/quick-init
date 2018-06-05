#!/usr/bin/env node

const program = require('commander');
const pkg = require('../package.json');

program
  .version(pkg.version)
  .option('-n, --name [name]', 'Input your name', 'friend')
  .parse(process.argv);

console.log(`Hello! ${program.name}!`);
