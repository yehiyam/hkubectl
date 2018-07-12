const { get } = require('../../helpers/request-helper');
const path = require('path');
const prettyjson = require('prettyjson');

const getHandler = async ({endpoint,rejectUnauthorized,name}) => {
    const path=`api/v1/store/pipelines/${name?name:""}`
    return get({
        endpoint,
        rejectUnauthorized,
        path
    });
}



module.exports = {
    command: 'get [name]',
    description: 'Gets an pipeline by name',
    options: {

    },
    builder: (yargs)=>{
        yargs.command(xxx);
        yargs.command(yyy);
        
    },
    handler: async (argv) => {
        const ret = await getHandler(argv);
        console.log(prettyjson.render(ret));
    }
}
