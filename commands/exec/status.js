const prettyjson = require('prettyjson');
const { get } = require('../../helpers/request-helper');

const executeHandler = async ({ endpoint, rejectUnauthorized, jobId }) => {
    const path = `exec/status/${jobId}`;
    return get({
        endpoint,
        rejectUnauthorized,
        path
    });
}

module.exports = {
    command: 'status <jobId>',
    alias: ['e'],
    description: 'Returns a status for the current pipeline',
    options: {
    },
    builder: {
        jobId: {
            demandOption: true,
            type: 'string'
        }
    },
    handler: async (argv) => {
        const ret = await executeHandler(argv);
        console.log(prettyjson.render(ret));
    }
}
