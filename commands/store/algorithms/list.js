const { get } = require('../../../helpers/request-helper');
const prettyjson = require('prettyjson');

const list = async (argv) => {
    const path = 'store/algorithms';
    return get({
        ...argv,
        path
    });
}

module.exports = {
    command: 'list',
    description: 'Lists all registered algorithms',
    options: {

    },
    builder: {},
    handler: async (argv) => {
        const ret = await list(argv);
        console.log(prettyjson.render(ret, { inlineArrays: true }));
    }
}
