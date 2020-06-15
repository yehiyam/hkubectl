const path = require('path');
const prettyjson = require('prettyjson');
const socketTunnelClient = require('../../helpers/tcpTunnel/client');
const agentSyncIngressPath = '/hkube/sync/sync'
const agentRestIngressPath = '/hkube/sync/ui'
const syncthing = require('../../helpers/syncthing/syncthing.js');
const watchHandler = async ({ endpoint, rejectUnauthorized, algorithmName, folder, port, bidi }) => {
    const tunnelUrl = `${endpoint}/${agentSyncIngressPath}`.replace('http', 'ws')
    try {
        const ret = await socketTunnelClient(tunnelUrl, 'localhost:22000', port, { rejectUnauthorized });
        await syncthing.start({ tunnelUrl: `${endpoint}/${agentRestIngressPath}`, tunnelPort: port })
        await syncthing.addFolder({ path: path.resolve(folder), algorithmName, bidi })
        

    } catch (error) {
        console.error(`error connecting to cluster. Error: ${error.message}`)
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
            alias: ['algorithm-name', 'a']
        },
        folder: {
            demandOption: false,
            describe: 'local folder to sync.',
            default: './',
            type: 'string'
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
        const ret = await watchHandler(argv)
    }
}