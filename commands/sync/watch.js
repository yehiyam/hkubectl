const path = require('path');
const socketTunnelClient = require('../../helpers/tcpTunnel/client');
const agentSyncIngressPath = '/hkube/sync/sync'
const agentRestIngressPath = '/hkube/sync/ui'
const syncthing = require('../../helpers/syncthing/syncthing.js');
const { events } = require('../../helpers/consts');


const watchHandler = async ({ endpoint, rejectUnauthorized, algorithmName, folder, port, bidi }) => {
    const tunnelUrl = `${endpoint}/${agentSyncIngressPath}`.replace('http', 'ws')
    try {
        const fullPath = path.resolve(folder);
        console.log(`watching folder ${fullPath}`);
        await socketTunnelClient(tunnelUrl, 'localhost:22000', port, { rejectUnauthorized });
        await syncthing.start({ tunnelUrl: `${endpoint}/${agentRestIngressPath}`, tunnelPort: port })
        await syncthing.addFolder({ path: fullPath, algorithmName, bidi })
        syncthing.on('event', data => {
            if (data.folder !== algorithmName) {
                return;
            }
            switch (data.type) {
                case events.FolderSummary:
                    console.log(`[${data.name}] Algorithm ${data.folder} update started`)
                    break;
                case events.FolderCompletion:
                    console.log(`[${data.name}] Algorithm ${data.folder} update done`)
                    break;
            }
        })

    } catch (error) {
        console.error(`error connecting sync server. Error: ${error.message}`)
    }
}
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
        port: {
            demandOption: false,
            describe: 'local listen port for syncthing',
            default: '22001',
            type: 'number',
            alias: ['p']
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
        await watchHandler(argv)
    }
}