const fse = require('fs-extra');
const yaml = require('js-yaml');
const path = require('path');
const Zip = require('adm-zip');
const uuid = require('uuid/v4');
const { diff } = require('deep-diff');
const merge = require('lodash.merge');
const md5 = require('md5');
const prettyjson = require('prettyjson');
const { get, postFile } = require('../../helpers/request-helper');
const hkubePath = path.join(process.env.HOME, '/.hkube')

const CODE_UPDATE = [
    'checksum',
    'env'
];

const handleAdd = async ({ endpoint, rejectUnauthorized, file, name, ...cliContent }) => {
    const applyPath = 'api/v1/apply/algorithms';
    const storePath = 'api/v1/store/algorithms';

    let stream, zipFile, checksum, result, error;
    try {
        const fileContent = readFile(file);
        const fileData = adaptFileData(fileContent.result);
        const cliData = adaptCliData(cliContent);
        const options = merge({}, fileData, cliData);

        const algorithm = await get({
            endpoint,
            rejectUnauthorized,
            path: `${storePath}/${name}`
        });

        if (algorithm.error && algorithm.error.code === 'ECONNREFUSED') {
            throw new Error(`unable to connect to ${endpoint}`);
        }

        if (options.code && options.code.path) {
            // const zip = new Zip();
            // zipFile = `${hkubePath}/${name}-${uuid()}.zip`;
            // zip.addLocalFolder(code.path);
            // zip.writeZip(zipFile);
            const buffer = fse.readFileSync(options.code.path);
            checksum = md5(buffer);
        }

        const body = {
            name,
            env: options.env,
            cpu: options.cpu,
            mem: options.mem,
            checksum,
            codeEntryPoint: options.codeEntryPoint,
            algorithmImage: options.image,
            algorithmEnv: options.algorithmEnv,
            workerEnv: options.workerEnv
        };

        const shouldPost = shouldPostFile(algorithm.result, body);
        if (shouldPost) {
            stream = fse.createReadStream(options.codePath);
        }

        const formData = {
            payload: JSON.stringify(body),
            code: stream || ''
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
    finally {
        // if (zipFile) {
        //     fse.removeSync(zipFile);
        // }
    }
    return { error, result };
};

const readFile = (file) => {
    let result, error;
    try {
        if (fse.existsSync(file)) {
            result = yaml.safeLoad(fse.readFileSync(file, 'utf8'));
        }
    }
    catch (e) {
        error = e.message;
    }
    return { error, result };
}

const adaptFileData = (fileData) => {
    const { name, env, code, resources, image, algorithmEnv, workerEnv } = fileData || {};
    const { cpu, mem } = resources || {};
    const { path, entryPoint } = code || {};
    return { name, env, image, cpu, mem, algorithmEnv, workerEnv, codePath: path, codeEntryPoint: entryPoint };
}

const adaptCliData = (cliData) => {
    const { env, image, cpu, mem, algorithmEnv, workerEnv, codePath, codeEntryPoint } = cliData || {};
    return { env, image, cpu, mem, algorithmEnv, workerEnv, codePath, codeEntryPoint };
}

const shouldPostFile = (algorithmOld, algorithmNew) => {
    let shouldPostFile = false;
    const differences = diff(algorithmOld, algorithmNew);
    differences.forEach((d) => {
        const field = d.path.join('.');
        if (CODE_UPDATE.includes(field)) {
            shouldPostFile = true;
        }
    });
    return shouldPostFile;
}

module.exports = {
    command: 'apply <name>',
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
        'codePath': {
            describe: 'the code path for the algorithm',
            type: 'string',
            alias: ['cp']
        },
        'codeEntryPoint': {
            describe: 'the code entry point for the algorithm',
            type: 'string',
            alias: ['ce']
        },
        'cpu': {
            describe: 'CPU requirements of the algorithm in cores',
            type: 'number',
            alias: ['c']
        },
        'mem': {
            describe: "memory requirements of the algorithm. Possible units are ['Ki', 'M', 'Mi', 'Gi', 'm', 'K', 'G', 'T', 'Ti', 'P', 'Pi', 'E', 'Ei']. Minimum is 4Mi",
            type: 'string',
            alias: ['m']
        },
        'workerEnv': {
            describe: 'key-value of environment variables for the worker containers. You can specify more than one. example: --workerEnv.foo=bar --workerEnv.baz=bar',
            type: 'object',
            alias: ['we']
        },
        'algorithmEnv': {
            describe: 'key-value of environment variables for the algorithm containers. You can specify more than one. example: --algorithmEnv.foo=bar --algorithmEnv.baz=bar',
            type: 'object',
            alias: ['ae']
        }
    },
    handler: async (argv) => {
        const ret = await handleAdd(argv);
        console.log(prettyjson.render(ret));
    }
}
