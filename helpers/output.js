const prettyjson = require('prettyjson');
const yargs = require('yargs');

const tryJson = (data) => {
    try {
        return JSON.stringify(data, null, 2);
    }
    catch (error) {
        return data;
    }
};
const log = (data, options) => {
    const { json } = yargs.argv;
    if (json) {
        console.log(tryJson(data));
    }
    else {
        console.log(prettyjson.render(data, options));
    }
};
module.exports = {
    log
};
