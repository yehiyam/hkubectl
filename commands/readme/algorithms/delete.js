const { del } = require('../../../helpers/request-helper');
const { log } = require('../../../helpers/output');

const delHandler = async ({ endpoint, rejectUnauthorized, name }) => {
    const path = `store/algorithms/${name}`;
    return del({
        endpoint,
        rejectUnauthorized,
        path
    });
};

module.exports = {
    command: 'delete <name>',
    description: 'Deletes the readme of an algorithm by name',
    builder: (yargs) => {
        yargs.positional('name', {
            demandOption: 'Please provide the algorithm name',
            describe: 'The name of the algorithm',
            type: 'string'
        });
    },
    handler: async (argv) => {
        const ret = await delHandler(argv);
        log(ret, argv);
    }
};
