const commands = require('../commands/readme/algorithms/index');

const exec = {
    command: 'readme <command>',
    description: 'Execution pipelines as raw or stored',
    builder: (yargs) => {
        Object.values(commands).forEach((cmd) => {
            yargs.command(cmd);
        });
        return yargs;
    },
    handler: () => { }
};

module.exports = {
    exec
};
