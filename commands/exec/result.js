const { log } = require('../../helpers/output');
const { get } = require('../../helpers/request-helper');

const executeHandler = async ({ endpoint, rejectUnauthorized, jobId }) => {
    const path = `exec/results/${jobId}`;
    return get({
        endpoint,
        rejectUnauthorized,
        path
    });
};

module.exports = {
    command: 'result <jobId>',
    description: 'returns result for the execution of a specific pipeline run',
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
