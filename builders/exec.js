const commands = require('../commands/exec/index');

const exec = {
    command: 'exec <command>',
    description: 'Execution pipelines as raw or stored',
    builder: (yargs) => {
        Object.values(commands).forEach((cmd) => {
            yargs.command(cmd);
        });
        yargs.options('endpoint', {
            alias: ['e'],
            description: 'url of hkube api endpoint',
            type: 'string',
            default: 'http://127.0.0.1/hkube/api-server/'
        })
            .options('rejectUnauthorized', {
                description: 'set to false to ignore certificate signing errors. Useful for self signed TLS certificate',
                type: 'boolean',
                default: 'true'
            }).strict();
        return yargs;
    },
    handler: () => { }
};

module.exports = {
    exec
};
