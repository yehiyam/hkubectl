const commands = require('../commands/sync');

const sync = {
    command: 'sync <command>',
    description: 'sync local source folder into algorithm container in the cluster',
    builder: (yargs) => {
        Object.values(commands).forEach((cmd) => {
            yargs.command(cmd);
        });

        return yargs;
    },
    handler: () => { }
};

module.exports = sync;
