const prettyjson = require('prettyjson');
const { post } = require('../../helpers/request-helper');

const handleAdd = async ({ endpoint, rejectUnauthorized, name, image, cpu, mem, workerEnv, algorithmEnv }) => {
    const path = 'store/algorithms';
    const body = {
        name,
        algorithmImage: image,
        cpu,
        mem,
        workerEnv,
        algorithmEnv
    }
    return post({
        endpoint,
        rejectUnauthorized,
        body,
        path
    });
};

module.exports = {
    command: 'add <name>',
    description: 'Adds an algorithm',
    options: {

    },
    builder: {
        'image': {
            demandOption: true,
            describe: 'the docker image for the algorithm',
            type: 'string'
        },
        'cpu': {
            demandOption: true,
            describe: 'CPU requirements of the algorithm in cores',
            type: 'number'
        },
        'mem': {
            demandOption: false,
            describe: "memory requirements of the algorithm. Possibel units are ['Ki', 'M', 'Mi', 'Gi', 'm', 'K', 'G', 'T', 'Ti', 'P', 'Pi', 'E', 'Ei']. Minimum is 4Mi",
            type: 'string'
        },
        'workerEnv': {
            describe: 'key-value of environment variables for the worker containers. You can specify more than one. example: --workerEnv.foo=bar --workerEnv.baz=bar',
            type: 'object'
        },
        'algorithmEnv': {
            describe: 'key-value of environment variables for the algorithm containers. You can specify more than one. example: --algorithmEnv.foo=bar --algorithmEnv.baz=bar',
            type: 'object'
        }
    },
    handler: async (argv) => {
        const ret = await handleAdd(argv);
        console.log(prettyjson.render(ret));
    }
}
