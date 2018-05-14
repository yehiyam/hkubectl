const prettyjson = require('prettyjson');
const { put, get } = require('../../helpers/request-helper');
const merge = require('lodash.merge');
const handleUpdate = async ({ endpoint, rejectUnauthorized, name, image, cpu, mem }) => {
    const path = './api/v1/store/algorithms';
    const retResponse = await get({
        endpoint,
        rejectUnauthorized,
        path:`${path}/${name}`
    });
    const body = merge({...retResponse},{name}, {algorithmImage: image}, {cpu}, {mem});
    // const body = {
    //     ...retResponse,
    //     name,
    //     algorithmImage: image,
    //     cpu,
    //     mem
    // }
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
            describe: 'CPU requirements of the algorithm in milli-cores',
            type: 'number'
        },
        'mem': {
            describe: 'memory requirements of the algorithm in bytes',
            type: 'number'
        }
    },
    handler:async (argv) => {
        const ret = await handleUpdate(argv);
        console.log(prettyjson.render(ret));
    }
}
