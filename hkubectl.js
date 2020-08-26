const yargs = require('yargs');
const chalk = require('chalk');
const { readConfig } = require('./helpers/config');
const { config } = require('./builders/config');
const { exec } = require('./builders/exec');
const algorithms = require('./builders/algorithm');
const pipelines = require('./builders/pipeline');
const dryRun = require('./builders/dry-run');
const sync = require('./builders/sync');
const syncthing = require('./helpers/syncthing/syncthing.js');

const handleSignals = () => {
    process.on('SIGINT', async () => {
        await syncthing.remove();
        process.exit(0);
    });
};
const main = async () => {
    handleSignals();

    const configFile = await readConfig();

    yargs.config(configFile);
    yargs.command(exec);
    yargs.command(algorithms);
    yargs.command(pipelines);
    yargs.command(dryRun);
    yargs.command(sync);
    yargs.command(config);
    yargs.options('rejectUnauthorized', {
        description: 'set to false to ignore certificate signing errors. Useful for self signed TLS certificate',
        type: 'boolean'
    });
    yargs.options('endpoint', {
        description: 'url of hkube api endpoint',
        type: 'string'
    });
    yargs.options('verbose', {
        description: 'verbose logging',
        type: 'boolean'
    });
    yargs.options('json', {
        description: 'output json to stdout',
        type: 'boolean',
        alias: ['j']
    })
        .recommendCommands()
        .showHelpOnFail()
        .help()
        .epilog(chalk.bold('for more information visit http://hkube.io'))
        .completion();

    const args = yargs.argv;

    if (!args._[0]) {
        if (args.endpoint) {
            yargs.showHelp();
        }
        else {
            config.handler(args);
        }
    }
};

module.exports = main;
