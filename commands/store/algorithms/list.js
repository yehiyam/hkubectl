const { get } = require('../../../helpers/request-helper');
const { log } = require('../../../helpers/output');

const list = async (argv) => {
    const path = 'store/algorithms';
    const algorithms = await get({
        ...argv,
        path
    });
    if (!algorithms || !algorithms.result) {
        return algorithms;
    }
    return algorithms.result.map(a => a.name);
};

module.exports = {
    command: 'list',
    description: 'Lists all registered algorithms',
    options: {

    },
    builder: {},
    handler: async (argv) => {
        const ret = await list(argv);
        log(ret, { ...argv });
    }
};
