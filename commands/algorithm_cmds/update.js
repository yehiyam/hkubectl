const prettyjson = require('prettyjson');
const { put, get } = require('../../helpers/request-helper');
const merge = require('lodash.merge');
const handleUpdate = async ({ endpoint, rejectUnauthorized, name, image, cpu, mem, workerEnv, algorithmEnv }) => {
    const path = './api/v1/store/algorithms';
    const retResponse = await get({
        endpoint,
        rejectUnauthorized,
        path: `${path}/${name}`
    });
    if (retResponse.mem != null) {
        retResponse.mem = `${retResponse.mem}Mi`
    }
    const body = merge({ ...retResponse }, { name }, { algorithmImage: image }, { cpu }, { mem }, { workerEnv }, { algorithmEnv });
    return put({
        endpoint,
        rejectUnauthorized,
        body,
        path
    });
};

module.exports = {
    command: 'update <name>',
    description: 'update an algorithm',
    options: {

    },
    builder: {
        'image': {
            describe: 'the docker image for the algorithm',
            type: 'string'
        },
        'cpu': {
            describe: 'CPU requirements of the algorithm in cores',
            type: 'number'
        },
        'mem': {
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
        const ret = await handleUpdate(argv);
        console.log(prettyjson.render(ret));
    }
}
