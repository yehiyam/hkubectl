const fs = require('fs');
const path = require('path');
const Zip = require('adm-zip');
const uuid = require('uuid/v4');
const prettyjson = require('prettyjson');
const { post, postFile } = require('../../helpers/request-helper');
const hkubePath = path.join(process.env.HOME, '/.hkube')

const handleAdd = async ({ endpoint, rejectUnauthorized, name, env, code, cpu, mem, workerEnv, algorithmEnv }) => {
    const store = 'api/v1/store/algorithms';
    const create = 'api/algorithms/create';

    const file = `${hkubePath}/${name}-${uuid()}.zip`;
    const zip = new Zip();

    zip.addLocalFolder(code);
    zip.writeZip(file);

    const body = {
        name,
        env,
        cpu,
        mem,
        workerEnv,
        algorithmEnv
    }
    const formData = {
        payload: JSON.stringify(body),
        code: fs.createReadStream(file)
    };
    const result = await post({
        endpoint,
        rejectUnauthorized,
        body,
        path: store
    });
    await postFile({
        endpoint,
        rejectUnauthorized,
        formData,
        path: create
    });
    fs.unlink(file, (err) => {
        if (err) {

        }
    });
};

module.exports = {
    command: 'create <name>',
    description: 'creates an algorithm',
    options: {

    },
    builder: {
        'env': {
            demandOption: true,
            describe: 'the algorithm env',
            type: 'string'
        },
        'code': {
            demandOption: true,
            describe: 'the algorithm code',
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
