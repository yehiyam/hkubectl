#!/usr/bin/env node
const yargs = require('yargs');
const { readConfig } = require('./helpers/config');
const { config } = require('./commands/config');
const { exec } = require('./commands/exec');
// const { readme } = require('./commands/readme');
const algorithms = require('./commands/algorithm');
const pipelines = require('./commands/pipeline');

const main = async () => {
  const configFile = await readConfig();

  yargs.config(configFile);
  yargs.command(exec)
  yargs.command(algorithms)
  yargs.command(pipelines)
  yargs.command(config)
    .demandCommand()
    .help()
    .epilog('for more information visit http://hkube.io')
    .completion()
    .argv;

}

main();
