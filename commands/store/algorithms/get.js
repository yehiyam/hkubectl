const { get } = require('../../../helpers/request-helper');
const { log } = require('../../../helpers/output');

const getHandler = async ({ endpoint, rejectUnauthorized, name }) => {
    const path = `store/algorithms/${name}`;
    return get({
        endpoint,
        rejectUnauthorized,
        path
    });
};

module.exports = {
    command: 'get <name>',
    description: 'Gets an algorithm by name',
    builder: (yargs) => {
        yargs.positional('name', {
            demand: 'Please provide the algorithm name',
            describe: 'The name of the algorithm',
            type: 'string'
        });
    },
    handler: async (argv) => {
        const ret = await getHandler(argv);
        log(ret.result || ret, argv);
    }
};
