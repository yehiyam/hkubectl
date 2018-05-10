const request = require('request-promise');
const path = require('path');
const prettyjson = require('prettyjson');

const list = async ({endpoint}) => {
    const uri = endpoint+'/api/v1/store/algorithms'
    return request({
        uri,
        rejectUnauthorized:false
    });
}



module.exports = {
    command: 'list',
    description: 'Lists all registered algorithms',
    options: {

    },
    builder: {},
    handler: async (argv) => {
        console.log(`list command called with ${JSON.stringify(argv)}`);
        const ret = await list(argv);
        console.log(prettyjson.renderString(ret));
    }
}
