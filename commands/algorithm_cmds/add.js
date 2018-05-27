const prettyjson = require('prettyjson');
const { post } = require('../../helpers/request-helper');

const handleAdd = async ({ endpoint, rejectUnauthorized, name, image, cpu, mem = 0 }) => {
    const path = './api/v1/store/algorithms';
    const body = {
        name,
        algorithmImage: image,
        cpu,
        mem
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
            describe: 'CPU requirements of the algorithm in milli-cores',
            type: 'number'
        },
        'mem': {
            demandOption: false,
            describe: 'memory requirements of the algorithm in bytes',
            type: 'number'
        }
    },
    handler: async (argv) => {
        const ret = await handleAdd(argv);
        console.log(prettyjson.render(ret));
    }
}
