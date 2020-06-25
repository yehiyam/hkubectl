const { get } = require('../../helpers/request-helper');
const prettyjson = require('prettyjson');

const getHandler = async ({ endpoint, rejectUnauthorized, name }) => {
    const path = `store/algorithms/${name ? name : ""}`
    return get({
        endpoint,
        rejectUnauthorized,
        path
    });
}

module.exports = {
    command: 'get [name]',
    description: 'Gets an algorithm by name',
    options: {

    },
    builder: {},
    handler: async (argv) => {
        const ret = await getHandler(argv);
        console.log(prettyjson.render(ret));
    }
}