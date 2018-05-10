#!/usr/bin/env node
const yargs = require('yargs');
const {algorithm} = require('./commands/algorithm')
yargs.command(algorithm)
  .demandCommand()
  .help()
  .options('endpoint',{
      description: 'url of hkube api endpoint'
  })
  .epilog('for more information visit http://hkube.io')
  .argv

