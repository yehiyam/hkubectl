const prettyjson = require('prettyjson');
const { handleApply } = require('./applyImpl');
const { askMissingValues } = require('../../../helpers/input');
const input = require('../../../helpers/input');

module.exports = {
    command: 'apply [name]',
    description: 'apply an algorithm',
    options: {
    },
    builder: (yargs) => {
        const options = {
            file: {
                describe: 'the algorithm file',
                type: 'string',
                alias: ['f']
            },
            env: {
                describe: 'the algorithm env',
                type: 'string',
                choices: ['python', 'nodejs']

            },
            codePath: {
                describe: 'the code path for the algorithm',
                type: 'string',
            },
            codeEntryPoint: {
                describe: 'the code entry point for the algorithm',
                type: 'string',
                alias: ['entryPoint']
            },
            cpu: {
                describe: 'CPU requirements of the algorithm in cores',
                type: 'number',
            },
            gpu: {
                describe: 'GPU requirements of the algorithm in cores',
                type: 'number',
            },
            mem: {
                describe: "memory requirements of the algorithm. Possible units are ['Ki', 'M', 'Mi', 'Gi', 'm', 'K', 'G', 'T', 'Ti', 'P', 'Pi', 'E', 'Ei']. Minimum is 4Mi",
                type: 'string',
            },
            noWait: {
                describe: 'if true, does not wait for the build to finish',
                type: 'boolean',
                default: false,
            },
            setCurrent: {
                describe: 'if true, sets the new version as the current version',
                type: 'boolean',
                default: false
            }
        }
        yargs.middleware(async (args, yargs) => {
            const fillMissing = [
                { name: 'env', type: 'list' },
                { name: 'codeEntryPoint', type: 'input' },
                { name: 'codePath', type: 'input', default: './', when: answers=>!answers.file }

            ]
            return await askMissingValues(fillMissing, options, args);
        })
        yargs.options(options)

        yargs.completion()
        return yargs;
    },
    handler: async (argv) => {
        const ret = await handleApply(argv);
        if (ret.error) {
            console.log(prettyjson.render(ret.error));
        }
    }
}
