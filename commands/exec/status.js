const { log } = require('../../helpers/output');
const { get } = require('../../helpers/request-helper');

const executeHandler = async ({ endpoint, rejectUnauthorized, jobId }) => {
    const path = `exec/status/${jobId}`;
    return get({
        endpoint,
        rejectUnauthorized,
        path
    });
};

module.exports = {
    command: 'status <jobId>',
    description: 'Returns a status for the current pipeline',
    options: {
    },
    builder: (yargs) => {
        yargs.positional('jobId', {
            demandOption: 'Please provide the job Id',
            describe: 'The jobId to get the result',
            type: 'string'
        });
    },
    handler: async (argv) => {
        const ret = await executeHandler(argv);
        log(ret);
    }
};
