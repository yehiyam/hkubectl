#!/usr/bin/env node
const yargs = require('yargs');
const { readConfig } = require('./helpers/config');
const { algorithm } = require('./commands/algorithm');

const main = async () => {
  const config = readConfig();
  yargs.config(config);
  yargs.command(algorithm)
    .demandCommand()
    .help()
    .options('endpoint', {
      description: 'url of hkube api endpoint',
      required: true,
      type: "string"
    })
    .options('rejectUnauthorized', {
      description: 'set to false to ignore certificate signing errors. Useful for self signed TLS certificate',
      type: "boolean",
      default: "true"
    })
    .epilog('for more information visit http://hkube.io')
    .argv
}

main();
