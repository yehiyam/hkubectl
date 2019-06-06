const commands = require('../commands/config/index.js');

const config = {
    command: 'config <command>',
    description: 'Set configuration options for hkubectl',
    builder: (yargs) => {
        Object.values(commands).forEach((cmd) => {
            yargs.command(cmd)
        });
        return yargs;
    },
    handler: () => { }
}

module.exports = {
    config
}