const prettyjson = require('prettyjson');
const { handleApply } = require('./applyImpl');

module.exports = {
    command: 'apply [name]',
    description: 'apply an algorithm',
    options: {
    },
    builder: {
        file: {
            demandOption: false,
            describe: 'the algorithm file',
            type: 'string',
            alias: ['f']
        },
        env: {
            describe: 'the algorithm env',
            type: 'string',
            alias: ['env']
        },
        image: {
            describe: 'the docker image for the algorithm',
            type: 'string',
            alias: ['i']
        },
        version: {
            describe: 'the version for docker image',
            type: 'string',
            alias: ['version']
        },
        codePath: {
            describe: 'the code path for the algorithm',
            type: 'string',
            alias: ['codePath']
        },
        codeEntryPoint: {
            describe: 'the code entry point for the algorithm',
            type: 'string',
            alias: ['codeEntryPoint']
        },
        cpu: {
            describe: 'CPU requirements of the algorithm in cores',
            type: 'number',
            alias: ['cpu']
        },
        gpu: {
            describe: 'GPU requirements of the algorithm in cores',
            type: 'number',
            alias: ['gpu']
        },
        mem: {
            describe: "memory requirements of the algorithm. Possible units are ['Ki', 'M', 'Mi', 'Gi', 'm', 'K', 'G', 'T', 'Ti', 'P', 'Pi', 'E', 'Ei']. Minimum is 4Mi",
            type: 'string',
            alias: ['mem']
        },
        workerEnv: {
            describe: 'key-value of environment variables for the worker containers. You can specify more than one. example: --workerEnv.foo=bar --workerEnv.baz=bar',
            type: 'object',
            alias: ['workerEnv']
        },
        algorithmEnv: {
            describe: 'key-value of environment variables for the algorithm containers. You can specify more than one. example: --algorithmEnv.foo=bar --algorithmEnv.baz=bar',
            type: 'object',
            alias: ['algorithmEnv']
        },
        noWait: {
            describe: 'if true, does not wait for the build to finish',
            type: 'boolean',
            default: false,
            alias:['w']
        },
        setCurrent: {
            describe: 'if true, sets the new version as the current version',
            type: 'boolean',
            default: false
        }
    },
    handler: async (argv) => {
        const ret = await handleApply(argv);
        if (ret.error){
            console.log(prettyjson.render(ret.error));
        }
    }
}
