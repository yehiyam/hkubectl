const prettyjson = require('prettyjson');
const { post } = require('../../helpers/request-helper');
const path = `exec/stop/`;

const executeHandler = async ({ endpoint, rejectUnauthorized, jobId, reason }) => {
    const body = {
        jobId,
        reason
    }
    return post({
        endpoint,
        rejectUnauthorized,
        path,
        body
    });
}

module.exports = {
    command: 'stop <jobId> [reason]',
    alias: ['e'],
    description: 'call to stop pipeline execution',
    options: {
    },
    builder: {
        jobId: {
            demandOption: true,
            type: 'string'
        },
        reason: {
            demandOption: false,
            type: 'string'
        }
    },
    handler: async (argv) => {
        const ret = await executeHandler(argv);
        console.log(prettyjson.render(ret));
    }
}
