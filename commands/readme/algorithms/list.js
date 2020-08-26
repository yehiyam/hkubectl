const { get } = require('../../../helpers/request-helper');
const { log } = require('../../../helpers/output');

const list = async (argv) => {
    const path = 'store/algorithms';
    return get({
        ...argv,
        path
    });
};

module.exports = {
    command: 'list',
    description: 'Lists all registered algorithms',
    options: {

    },
    builder: {},
    handler: async (argv) => {
        const ret = await list(argv);
        log(ret, { ...argv, printOptions: { inlineArrays: true } });
    }
};
