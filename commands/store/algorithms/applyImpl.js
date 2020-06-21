const os = require('os');
const path = require('path');
const fse = require('fs-extra');
const yaml = require('js-yaml');
const merge = require('lodash.merge');
var FormData = require('form-data');
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
            const codePath = path.resolve(
                file?path.dirname(file):process.cwd(),
                code.path);
            stream = fse.createReadStream(codePath);
        }

        const formData = new FormData()
        formData.append('payload',JSON.stringify(body))
        formData.append('file', stream || '')

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
    const { name, env, image, version, code, resources, algorithmEnv, workerEnv, minHotWorkers, nodeSelector, baseImage, options } = fileData || {};
    const { cpu, gpu, mem } = resources || {};
    return { name, env, code: code || {}, version, algorithmImage: image, baseImage, options, cpu, gpu, mem, algorithmEnv, workerEnv, minHotWorkers, nodeSelector };
};

const adaptCliData = (cliData) => {
    const { env, image, ver, cpu, gpu, mem, algorithmEnv, workerEnv, codePath, codeEntryPoint, baseImage, options } = cliData || {};
    return { env, algorithmImage: image, baseImage, version: ver, cpu, gpu, mem, algorithmEnv, workerEnv, options, code: { path: codePath, entryPoint: codeEntryPoint } };
};

module.exports = {
    handleApply
}