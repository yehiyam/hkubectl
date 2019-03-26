const os = require('os');
const fse = require('fs-extra');
const yaml = require('js-yaml');
const { diff } = require('deep-diff');
const merge = require('lodash.merge');
const md5 = require('md5');
const prettyjson = require('prettyjson');
const { get, postFile } = require('../../helpers/request-helper');
const applyPath = 'api/v1/store/algorithms/apply';
const storePath = 'api/v1/store/algorithms';

const handleAdd = async ({ endpoint, rejectUnauthorized, file, ...cli }) => {

    let result, error;
    try {
        let stream, checksum;
        const fileContent = readFile(file);
        if (fileContent.error) {
            throw new Error(fileContent.error);
        }
        const fileData = adaptFileData(fileContent.result);
        const cliData = adaptCliData(cli);
        const algorithmData = merge(fileData, cliData);

        const { code, ...algorithm } = algorithmData;

        const alg = await get({
            endpoint,
            rejectUnauthorized,
            path: `${storePath}/${algorithm.name}`
        });

        if (alg.error && alg.error.code === 'ECONNREFUSED') {
            throw new Error(`unable to connect to ${endpoint}`);
        }

        if (code.path) {
            const codePath = code.path;
            const buffer = fse.readFileSync(codePath);
            checksum = md5(buffer);
        }

        const body = {
            ...algorithm,
            entryPoint: code.entryPoint,
            fileInfo: {
                checksum
            },
            userInfo: {
                platform: os.platform(),
                hostname: os.hostname(),
                username: os.userInfo().username
            }
        };

        const shouldPost = shouldPostFile(alg.result, body);
        if (shouldPost && code.path) {
            stream = fse.createReadStream(code.path);
        }

        const formData = {
            payload: JSON.stringify(body),
            file: stream || ''
        };
        result = await postFile({
            endpoint,
            rejectUnauthorized,
            formData,
            path: applyPath
        });
    }
    catch (e) {
        error = e.message;
    }
    return { error, result };
};

const readFile = (file) => {
    let result, error;
    try {
        result = yaml.safeLoad(fse.readFileSync(file, 'utf8'));
    }
    catch (e) {
        error = e.message;
    }
    return { error, result };
};

const adaptFileData = (fileData) => {
    const { name, env, image, version, code, resources, algorithmEnv, workerEnv, minHotWorkers, nodeSelector } = fileData || {};
    const { cpu, gpu, mem } = resources || {};
    return { name, env, code: code || {}, version, algorithmImage: image, cpu, gpu, mem, algorithmEnv, workerEnv, minHotWorkers, nodeSelector };
};

const adaptCliData = (cliData) => {
    const { env, image, ver, cpu, gpu, mem, algorithmEnv, workerEnv, codePath, codeEntryPoint } = cliData || {};
    return { env, algorithmImage: image, version: ver, cpu, gpu, mem, algorithmEnv, workerEnv, code: { path: codePath, entryPoint: codeEntryPoint } };
};

const CODE_UPDATE = [
    'code.checksum',
    'env'
];

const shouldPostFile = (algorithmOld, algorithmNew) => {
    let shouldPostFile = false;
    if (!algorithmOld) {
        shouldPostFile = true;
    }
    else {
        const differences = diff(algorithmOld, algorithmNew);
        if (differences) {
            shouldPostFile = differences.some(d => CODE_UPDATE.includes(d.path.join('.')));
        }
    }
    return shouldPostFile;
};

module.exports = {
    command: 'apply',
    description: 'apply an algorithm',
    options: {
    },
    builder: {
        'file': {
            demandOption: true,
            describe: 'the algorithm file',
            type: 'string',
            alias: ['f']
        },
        'env': {
            describe: 'the algorithm env',
            type: 'string',
            alias: ['env']
        },
        'image': {
            describe: 'the docker image for the algorithm',
            type: 'string',
            alias: ['i']
        },
        'version': {
            describe: 'the version for docker image',
            type: 'string',
            alias: ['version']
        },
        'codePath': {
            describe: 'the code path for the algorithm',
            type: 'string',
            alias: ['codePath']
        },
        'codeEntryPoint': {
            describe: 'the code entry point for the algorithm',
            type: 'string',
            alias: ['codeEntryPoint']
        },
        'cpu': {
            describe: 'CPU requirements of the algorithm in cores',
            type: 'number',
            alias: ['cpu']
        },
        'gpu': {
            describe: 'GPU requirements of the algorithm in cores',
            type: 'number',
            alias: ['gpu']
        },
        'mem': {
            describe: "memory requirements of the algorithm. Possible units are ['Ki', 'M', 'Mi', 'Gi', 'm', 'K', 'G', 'T', 'Ti', 'P', 'Pi', 'E', 'Ei']. Minimum is 4Mi",
            type: 'string',
            alias: ['mem']
        },
        'workerEnv': {
            describe: 'key-value of environment variables for the worker containers. You can specify more than one. example: --workerEnv.foo=bar --workerEnv.baz=bar',
            type: 'object',
            alias: ['workerEnv']
        },
        'algorithmEnv': {
            describe: 'key-value of environment variables for the algorithm containers. You can specify more than one. example: --algorithmEnv.foo=bar --algorithmEnv.baz=bar',
            type: 'object',
            alias: ['algorithmEnv']
        }
    },
    handler: async (argv) => {
        const ret = await handleAdd(argv);
        console.log(prettyjson.render(ret));
    }
}
