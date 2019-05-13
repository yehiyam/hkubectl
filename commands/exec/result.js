const prettyjson = require('prettyjson');
const { get } = require('../../helpers/request-helper');

const executeHandler = async ({ endpoint, rejectUnauthorized, jobId }) => {
    const path = `exec/results/${jobId}`;
    return get({
        endpoint,
        rejectUnauthorized,
        path
    });
}

module.exports = {
    command: 'result <jobId>',
    alias: ['e'],
    description: 'returns result for the execution of a specific pipeline run',
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
