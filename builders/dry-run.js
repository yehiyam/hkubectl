const commands = require('../commands/dry-run');

const dryRun = {
    command: 'dry-run <command>',
    description: 'run pipeline locolly for debugging',
    builder: (yargs) => {
        Object.values(commands).forEach((cmd) => {
            yargs.command(cmd);
        });

        return yargs;
    },
    handler: () => { }
};

module.exports = dryRun;
