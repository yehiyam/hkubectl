const path = require('path')
const { URL } = require('url');
const prettyjson = require('prettyjson');
const fs = require('fs-extra');
const { writeValue } = require('../../helpers/config');

const handler = async ({ key, value }) => {
    return writeValue;
}

module.exports = {
    command: 'set [key] [value]',
    description: 'Sets configuration options.',
    options: {

    },
    builder: {},
    handler: async (argv) => {
        const ret = await handler(argv);
        console.log(prettyjson.render(ret));
    }
}
