const { post } = require('../../helpers/request-helper');
const path = require('path');
const prettyjson = require('prettyjson');
const fs = require('fs');


const executeHandler = async ({ endpoint, rejectUnauthorized, name = "", type = "stored", file = "" }) => {
    const path = `api/v1/exec/${type}/`;
    let buffer = "{}";

    if (file != "") {
        buffer = fs.readFileSync(file).toString();
    }
    const body = {
        name, ...JSON.parse(buffer)
    }
    console.log(body);
    return post({
        endpoint,
        rejectUnauthorized,
        path,
        body
    });
}

module.exports = {
    command: 'execute <name>',
    alias: ['e'],
    description: 'execute pipeline by name',
    options: {

    },
    builder: {
        'type': {
            demandOption: false,
            describe: 'run from stored or raw default <stored> ',
            type: 'string',
            alias: ['t']
        },
        'file': {
            demandOption: false,
            describe: 'file path/name for running pipeline ',
            type: 'string',
            alias: ['f']
        },
    },
    handler: async (argv) => {
        const ret = await executeHandler(argv);
        console.log(prettyjson.render(ret));
    }
}
