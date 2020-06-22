const os = require('os');
const path = require('path');
const fse = require('fs-extra');
const yaml = require('js-yaml');
const merge = require('lodash.merge');
const FormData = require('form-data');
const ora = require('ora');

const { postFile, getUntil, post } = require('../../../helpers/request-helper');
const { zipDirectory } = require('../../../helpers/zipper');
const { buildDoneEvents } = require('../../../helpers/syncthing/consts');

const applyPath = 'store/algorithms/apply';

const waitForBuild = async ({ endpoint, rejectUnauthorized, name, setCurrent, applyRes }) => {
    const error = applyRes.error || applyRes.result.error;
    if (error) {
        console.error(error.message || error);
        return { buildStatus: buildDoneEvents.failed };
    }
    const buildId = applyRes.result.result.buildId;
    let buildStatus = buildDoneEvents.completed;

    if (buildId) {
        // wait for build
        const spinner = ora({ text: `build ${buildId} in progress.`, spinner: 'line' }).start()
        let lastStatus = '';
        const buildResult = await getUntil({ endpoint, rejectUnauthorized, path: `builds/status/${buildId}` }, (res) => {
            if (lastStatus !== res.result.status) {
                spinner.text = res.result.status
            }
            lastStatus = res.result.status;
            return (Object.values(buildDoneEvents).includes(res.result.status))
        }, 1000 * 60 * 10)
        const { algorithmImage, version, status } = buildResult.result
        if (status === buildDoneEvents.completed) {
            spinner.succeed();
            if (setCurrent) {
                console.log(`Setting version ${version} as current`);
                await post({
                    endpoint, rejectUnauthorized, path: `versions/algorithms/apply`, body: {
                        name,
                        image: algorithmImage,
                        force: true
                    }
                })
            }
            else {
                console.log(`New version ${version} created. Set it as current from the dashboard`);

            }
        }
        else {
            spinner.fail();
            buildStatus = status;
            console.log(`built ${buildId} ${status}`)
        }
    }
    return { buildStatus };
}

const handleApply = async ({ endpoint, rejectUnauthorized, name, file, noWait, forceVersion, ...cli }) => {
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
        console.log(`Requesting build for algorithm ${algorithmData.name}`);

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
            let codePath = path.resolve(
                file ? path.dirname(file) : process.cwd(),
                code.path);
            const stats = await fse.stat(codePath);
            if (stats.isDirectory()) {
                // create zip file
                console.log(`Creating zip of ${codePath}`)
                const zipFileName = await zipDirectory(codePath, { tmpFile: true });
                codePath = zipFileName;
            }
            stream = fse.createReadStream(codePath);
        }

        const formData = new FormData()
        formData.append('payload', JSON.stringify(body))
        formData.append('file', stream || '')

        result = await postFile({
            endpoint,
            rejectUnauthorized,
            formData,
            path: applyPath
        });
        console.log(result.result.messages.join('\n'))
        if (!noWait) {
            await waitForBuild({ endpoint, rejectUnauthorized, name: body.name, setCurrent, applyRes: { result } });
        }
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
    handleApply,

}