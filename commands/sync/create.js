const path = require('path');
const prettyjson = require('prettyjson');
const socketTunnelClient = require('../../helpers/tcpTunnel/client');
const agentSyncIngressPath = '/hkube/sync/sync'
const agentRestIngressPath = '/hkube/sync/ui'
const syncthing = require('../../helpers/syncthing/syncthing.js');
const { events } = require('../../helpers/syncthing/consts');
const { zipDirectory } = require('../../helpers/zipper');
const { handleApply } = require('../store/algorithms/applyImpl');
const { getUntil, post, get } = require('../../helpers/request-helper');

const createHandler = async ({ endpoint, rejectUnauthorized, algorithmName, folder, entryPoint, env, baseImage }) => {
    try {
        const fullFolderPath = path.resolve(folder);
        console.log(`Creating zip of ${fullFolderPath}`)
        const zipFileName = await zipDirectory(fullFolderPath, { tmpFile: true });
        console.log(`Requesting build for algorithm ${algorithmName}`);
        const algorithmData = {
            codePath: zipFileName,
            options: {
                devMode: true
            },
            codeEntryPoint: entryPoint,
            env,
            baseImage
        }
        const applyRes = await handleApply({
            endpoint, rejectUnauthorized, name: algorithmName, zipFileName, ...algorithmData
        })
        const error = applyRes.error || applyRes.result.error;
        if (error) {
            console.error(error.message || error);
            return;
        }
        console.log(applyRes.result.result.messages.join('\n'))
        const buildId = applyRes.result.result.buildId;
        if (buildId) {
            // wait for build
            console.log(`build ${buildId} in progress.`);
            let lastStatus = '';
            const buildResult = await getUntil({ endpoint, rejectUnauthorized, path: `builds/status/${buildId}` }, (res) => {
                if (lastStatus !== res.result.status) {
                    console.log(res.result.status)
                }
                lastStatus = res.result.status;
                return (res.result.status === 'completed')
            }, 1000 * 60 * 10)
            const { algorithmImage, version } = buildResult.result
            console.log(`Setting version ${version} as current`);
            const setVersionRes = await post({
                endpoint, rejectUnauthorized, path: `versions/algorithms/apply`, body: {
                    name: algorithmName,
                    image: algorithmImage,
                    force: true
                }
            })
        }
        console.log(`algorithm ${algorithmName} is ready`)
        console.log('to sync the folder to the algorithm run')
        console.log(`hkubectl sync watch -a ${algorithmName} -f ${folder}`)

    } catch (error) {
        console.error(`error connecting to cluster. Error: ${error.message}`)
    }
}
module.exports = {
    command: 'create',
    description: 'creates the algorithm for development.',
    options: {
    },
    builder: {
        algorithmName: {
            demandOption: true,
            describe: 'The name of the algorithm',
            type: 'string',
            alias: ['a']
        },
        folder: {
            demandOption: false,
            describe: 'local folder to build from.',
            default: './',
            type: 'string',
            alias: ['f']
        },
        env: {
            describe: 'algorithm runtime environment',
            type: 'string',
            choices: ['python', 'nodejs']

        },
        entryPoint: {
            describe: 'the main file of the algorithm',
            type: 'string',
            demandOption: true,
            alias: ['e']
        },
        baseImage: {
            describe: 'base image for the algorithm',
            type: 'string'
        }
    },
    handler: async (argv) => {
        const ret = await createHandler(argv)
    }
}