const yaml = require('js-yaml');
const fse = require('fs-extra');
const { log } = require('../../helpers/output');
const { post } = require('../../helpers/request-helper');
const { waitForBuild } = require('../../helpers/results');

const path = 'exec/stored/';

const executeHandler = async ({ endpoint, rejectUnauthorized, name, noWait, noResult, file }) => {
    let result;

    if (file) {
        result = yaml.safeLoad(fse.readFileSync(file, 'utf8'));
    }
    const body = {
        name, ...result
    };
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
    return waitForBuild({ endpoint, rejectUnauthorized, execResult: execResult.result, noResult });
};

module.exports = {
    command: 'stored [name]',
    alias: ['e'],
    description: 'execute pipeline by name',
    options: {
    },
    builder: yargs => {
        yargs.positional('name', {
            demandOption: 'Please provide the algorithm name',
            describe: 'The name of the algorithm',
            type: 'string'
        });
        yargs.options({
            file: {
                demandOption: false,
                describe: 'file path/name for running pipeline',
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
        });
    },
    handler: async (argv) => {
        const ret = await executeHandler(argv);
        log(ret, argv);
    }
};
