const prettyjson = require('prettyjson');
const { put, get, putFile } = require('../../helpers/request-helper');
const merge = require('lodash.merge');
const fse = require("fs-extra");

const readmeUpdate = async (readmeFile, endpoint, rejectUnauthorized, name) => {
    const path = `readme/algorithms/${name}`;
    let stream = fse.createReadStream(readmeFile);
    const formData = {
        "README.md": {
            value: stream,
            options: {
                filename: "README.md"
            }
        }
    };
    const result = await putFile({
        endpoint,
        rejectUnauthorized,
        formData,
        path
    });
};

module.exports = {
    command: 'update <name>',
    description: 'update an algorithm',
    options: {

    },
    builder: {
        readmeFile: {
            describe: 'path for readme file. example: --readmeFile="./readme.md',
            type: "string"
        }
    },
    handler: async (argv) => {
        const ret = await handleUpdate(argv);
        console.log(prettyjson.render(ret));
    }
}
