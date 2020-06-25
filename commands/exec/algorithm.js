const yaml = require('js-yaml');
const prettyjson = require('prettyjson');
const fse = require('fs-extra');
const { post } = require('../../helpers/request-helper');
const {waitForBuild} = require('../../helpers/results');
const path = `exec/algorithm/`;



const executeHandler = async ({ endpoint, rejectUnauthorized, name, file, noWait,noResult }) => {
    let loadResult;

    if (file) {
        loadResult = yaml.safeLoad(fse.readFileSync(file, 'utf8'));
    }
    const body = {
        name, ...loadResult
    }
    const execResult = await post({
        endpoint,
        rejectUnauthorized,
        path,
        body
    });
    if (execResult.error) {
        return execResult.error;
    }
    if (noWait) {
        return execResult.result;
    }
    return waitForBuild({ endpoint, rejectUnauthorized, execResult: execResult.result,noResult })

}

module.exports = {
    command: 'algorithm [name]',
    alias: ['e'],
    description: 'execute algorithm',
    options: {
    },
    builder: {
        'file': {
            demandOption: false,
            describe: 'file path/name for extra data',
            type: 'string',
            alias: ['f']
        },
        noWait: {
            describe: 'if true, does not wait for the execution to finish',
            type: 'boolean',
            default: false,
        },
        noResult: {
            describe: 'if true, does not show the result of the execution',
            type: 'boolean',
            default: false,
        },
    },
    handler: async (argv) => {
        const ret = await executeHandler(argv);
        console.log(prettyjson.render(ret));
    }
}
