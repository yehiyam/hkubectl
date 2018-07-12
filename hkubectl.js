#!/usr/bin/env node
const yargs = require('yargs');
const { readConfig } = require('./helpers/config');
const { algorithm } = require('./commands/algorithm');
const { config } = require('./commands/config');
const { pipeline } = require('./commands/pipeline');
const main = async () => {
  const configFile = await readConfig();

  yargs.config(configFile);
  yargs.command(algorithm)
  yargs.command(pipeline)
  yargs.command(config)
    .demandCommand()
    .help()
    .epilog('for more information visit http://hkube.io')
    .completion()
    .argv;

}

main();
