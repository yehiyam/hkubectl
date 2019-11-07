const os = require('os');
const fse = require('fs-extra');
const yaml = require('js-yaml');
const merge = require('lodash.merge');
const prettyjson = require('prettyjson');
const { postFile } = require('../../../helpers/request-helper');
const applyPath = 'store/algorithms/apply';

const handleApply = async ({ endpoint, rejectUnauthorized, name, file, ...cli }) => {
    let result, error;
    try {
        let stream, fileData;
        if (file) {
            const fileContent = readFile(file);
            if (fileContent.error) {
                throw new Error(fileContent.error);
            }
            fileData = adaptFileData(fileContent.result);
        }

        const cliData = adaptCliData(cli);
        const algorithmData = merge(fileData, cliData, { name });

        const { code, ...algorithm } = algorithmData;

        const body = {
            ...algorithm,
            entryPoint: code.entryPoint,
            userInfo: {
                platform: os.platform(),
                hostname: os.hostname(),
                username: os.userInfo().username
            }
        };

        if (code.path) {
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
    const { name, env, image, version, code, resources, algorithmEnv, workerEnv, minHotWorkers, nodeSelector, baseImage } = fileData || {};
    const { cpu, gpu, mem } = resources || {};
    return { name, env, code: code || {}, version, algorithmImage: image, baseImage, cpu, gpu, mem, algorithmEnv, workerEnv, minHotWorkers, nodeSelector };
};

const adaptCliData = (cliData) => {
    const { env, image, ver, cpu, gpu, mem, algorithmEnv, workerEnv, codePath, codeEntryPoint, baseImage } = cliData || {};
    return { env, algorithmImage: image, baseImage, version: ver, cpu, gpu, mem, algorithmEnv, workerEnv, code: { path: codePath, entryPoint: codeEntryPoint } };
};

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
        }
    },
    handler: async (argv) => {
        const ret = await handleApply(argv);
        console.log(prettyjson.render(ret));
    }
}
