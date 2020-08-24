const { get } = require('../../helpers/request-helper');
const { log } = require('../../helpers/output');

const getHandler = ({ endpoint, rejectUnauthorized, jobId }) => {
    const path = `exec/pipelines/${jobId}`;
    return get({
        endpoint,
        rejectUnauthorized,
        path
    });
};

module.exports = {
    command: 'get <jobId>',
    description: 'Returns the executed pipeline data',
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
        const ret = await getHandler(argv);
        log(ret);
    }
};
