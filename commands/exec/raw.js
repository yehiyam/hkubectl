const yaml = require('js-yaml');
const prettyjson = require('prettyjson');
const fse = require('fs-extra');
const { post } = require('../../helpers/request-helper');
const path = `exec/raw/`;

const executeHandler = async ({ endpoint, rejectUnauthorized, name, file }) => {
    let result;

    if (file) {
        result = yaml.safeLoad(fse.readFileSync(file, 'utf8'));
    }
    const body = {
        name, ...result
    }
    return post({
        endpoint,
        rejectUnauthorized,
        path,
        body
    });
}

module.exports = {
    command: 'raw [name]',
    alias: ['e'],
    description: 'execute pipeline by name',
    options: {
    },
    builder: {
        file: {
            demandOption: false,
            describe: 'file path/name for running pipeline',
            type: 'string',
            alias: ['f']
        },
    },
    handler: async (argv) => {
        const ret = await executeHandler(argv);
        console.log(prettyjson.render(ret));
    }
}
