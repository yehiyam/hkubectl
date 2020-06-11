#!/usr/bin/env node
const yargs = require('yargs');
const { readConfig } = require('./helpers/config');
const { config } = require('./builders/config');
const { exec } = require('./builders/exec');
// const { readme } = require('./commands/readme');
const algorithms = require('./builders/algorithm');
const pipelines = require('./builders/pipeline');
const dryRun = require('./builders/dry-run');
const main = async () => {
  const configFile = await readConfig();

  yargs.config(configFile);
  yargs.command(exec)
  yargs.command(algorithms)
  yargs.command(pipelines)
  yargs.command(dryRun)
  yargs.command(config)
    .demandCommand()
    .help()
    .epilog('for more information visit http://hkube.io')
    .completion()
    .argv;
}

main();
