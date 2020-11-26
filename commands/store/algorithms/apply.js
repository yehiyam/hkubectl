const { log } = require('../../../helpers/output');
const { handleApply } = require('./applyImpl');
const { askMissingValues } = require('../../../helpers/input');

module.exports = {
    command: 'apply [name]',
    description: 'apply an algorithm',
    options: {
    },
    builder: (yargs) => {
        yargs.positional('name', {
            demandOption: 'Please provide the algorithm name',
            describe: 'The name of the algorithm',
            type: 'string'
        });
        const options = {
            file: {
                describe: 'the algorithm file',
                type: 'string',
                alias: ['f']
            },
            env: {
                describe: 'the algorithm env',
                type: 'string',
                choices: ['python', 'nodejs', 'java']
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
            image: {
                describe: 'set algorithm image',
                type: 'string',
                alias: ['algorithmImage']
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
                describe: "memory requirements of the algorithm. Possible units are ['Mi', 'Gi']. Minimum is 4Mi",
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
        };
        yargs.middleware((args) => {
            if (args.file || !args.codePath) {
                return null;
            }
            const fillMissing = [
                { name: 'env', type: 'list' },
                { name: 'codeEntryPoint', type: 'input' },
                { name: 'codePath', type: 'input', default: './', when: answers => !answers.file }

            ];
            return askMissingValues(fillMissing, options, args);
        });
        yargs.options(options);

        yargs.completion();
        return yargs;
    },
    handler: async (argv) => {
        const ret = await handleApply(argv);
        if (ret.error) {
            log(ret.error);
        }
    }
};
