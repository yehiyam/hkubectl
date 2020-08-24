const path = require('path');
const getPort = require('get-port');
const socketTunnelClient = require('../../helpers/tcpTunnel/client');
const agentSyncIngressPath = '/hkube/sync/sync';
const agentRestIngressPath = '/hkube/sync/ui';
const syncthing = require('../../helpers/syncthing/syncthing.js');
const { events } = require('../../helpers/consts');
const { lock } = require('../../helpers/locks');

const watchHandler = async ({ endpoint, rejectUnauthorized, algorithmName, folder, bidi }) => {
    const tunnelUrl = `${endpoint}/${agentSyncIngressPath}`.replace('http', 'ws');
    try {
        const fullPath = path.resolve(folder);
        console.log(`watching folder ${fullPath}`);
        let tunnelPort;
        const unlock = await lock('tunnelPort');
        try {
            tunnelPort = await getPort({ port: 22001 });
            await socketTunnelClient(tunnelUrl, 'localhost:22000', tunnelPort, { rejectUnauthorized });
        }
        finally {
            unlock();
        }

        await syncthing.start({ algorithmName, tunnelUrl: `${endpoint}/${agentRestIngressPath}`, tunnelPort });
        await syncthing.addFolder({ path: fullPath, algorithmName, bidi });
        syncthing.on('event', data => {
            if (data.folder !== algorithmName) {
                return;
            }
            switch (data.type) {
            case events.FolderSummary:
                console.log(`[${data.name}] Algorithm ${data.folder} update started`);
                break;
            case events.FolderCompletion:
                console.log(`[${data.name}] Algorithm ${data.folder} update done`);
                break;
            default:
                break;
            }
        });
    }
    catch (error) {
        console.error(`error connecting sync server. Error: ${error.message}`);
    }
};
module.exports = {
    command: 'watch',
    description: 'watch a local folder',
    options: {
    },
    builder: {
        algorithmName: {
            demandOption: true,
            describe: 'The name of the algorithm to sync data into',
            type: 'string',
            alias: ['a']
        },
        folder: {
            demandOption: false,
            describe: 'local folder to sync.',
            default: './',
            type: 'string',
            alias: ['f']
        },
        bidirectional: {
            demandOption: false,
            describe: 'Sync files in both ways',
            default: false,
            type: 'boolean',
            alias: ['bidi']
        }
    },
    handler: async (argv) => {
        await watchHandler(argv);
    }
};
