const prettyjson = require('prettyjson');
const fse = require('fs-extra');
const FormData = require('form-data');
const { postFile } = require('../../../helpers/request-helper');

const handleAdd = async ({ endpoint, rejectUnauthorized, name, readmeFile }) => {
    const path = `readme/algorithms/${name}`;
    const stream = fse.createReadStream(readmeFile);
    const formData = new FormData();
    formData.append('README.md', {
        value: stream,
        options: {
            filename: 'README.md'
        }
    });
    const result = await postFile({
        endpoint,
        rejectUnauthorized,
        formData,
        path
    });
    return result;
};

module.exports = {
    command: 'add <name>',
    description: 'Adds a Readme to the algorithm',
    options: {},
    builder: (yargs) => {
        yargs.positional('name', {
            demandOption: 'Please provide the algorithm name',
            describe: 'The name of the algorithm',
            type: 'string'
        });
        yargs.options('readmeFile', {
            describe: 'path for readme file. example: --readmeFile="./readme.md',
            type: 'string'
        });
    },
    handler: async argv => {
        const ret = await handleAdd(argv);
        console.log(prettyjson.render(ret));
    }
};
