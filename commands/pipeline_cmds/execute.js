const { post } = require('../../helpers/request-helper');
const path = require('path');
const prettyjson = require('prettyjson');

const executeHandler = async ({endpoint,rejectUnauthorized,name="",type="stored"}) => {
    const path=`api/v1/exec/${type}/`;
    const body ={
        name
    }
    return post({
        endpoint,
        rejectUnauthorized,
        path,
        body
    });
}



module.exports = {
    command: 'execute <name>',
    alias :['e'],
    description: 'execute pipeline by name',
    options: {

    },
    builder: {},
    handler: async (argv) => {
        const ret = await executeHandler(argv);
        console.log(prettyjson.render(ret));
    }
}
