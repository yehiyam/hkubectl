const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const replaceExt = require('replace-ext');
const { log } = require('../../../helpers/output');
const templates = require('../../../templates');
const extensions = {
    python: '.py',
    nodejs: '.js',
};
const _generateDefinitionFile = ({ env, ...rest }) => {
    const { definition } = templates[env];
    return definition({ env, ...rest });
};
const _generateSampleAlgorithm = ({ env, ...rest }) => {
    const { algorithm } = templates[env];
    return algorithm({ env, ...rest });
};
const template = async ({ name, codePath, codeEntryPoint, overwrite, env, ...rest }) => {
    const fullPath = path.resolve(codePath);
    const exist = await fs.pathExists(fullPath);
    if (exist && !overwrite) {
        return `${chalk.red('Error')}: Path ${fullPath} exists. Set the --overwrite option to overwrite`;
    }
    await fs.ensureDir(fullPath);
    const algorithm = _generateSampleAlgorithm({ name, env });
    const entryFile = replaceExt(codeEntryPoint, extensions[env]);

    const definition = _generateDefinitionFile({ name, env, ...rest, entryFile });

    const algorithmFileName = path.join(fullPath, entryFile);
    await fs.writeFile(algorithmFileName, algorithm);
    const definitionFileName = path.join(fullPath, replaceExt(entryFile, '.yaml'));
    await fs.writeFile(definitionFileName, definition);
    return `
Algorithm ${chalk.bold(name)} was created in ${chalk.bold(codePath)}
To Build:
hkubectl algorithm apply -f ${definitionFileName}
`;
};

module.exports = {
    command: 'template [name]',
    description: 'Create algorithm template for builds',
    options: {},
    builder: (yargs) => {
        yargs.positional('name', {
            demandOption: 'Please provide the algorithm name',
            describe: 'The name of the algorithm',
            type: 'string'
        });
        const options = {
            codePath: {
                describe: 'the code path for the algorithm',
                demandOption: 'Enter path to algorithm folder',
                type: 'string',
            },
            codeEntryPoint: {
                describe: 'the code entry point for the algorithm',
                type: 'string',
                alias: ['entryPoint'],
                default: 'main'
            },
            env: {
                describe: 'the algorithm env',
                type: 'string',
                demandOption: 'Please specify build environment',
                choices: ['python', 'nodejs']
            },
            overwrite: {
                describe: 'overwrite an existing folder',
                type: 'boolean',
            },
            cpu: {
                describe: 'CPU requirements of the algorithm in cores',
                type: 'number',
                default: 0.1
            },
            gpu: {
                describe: 'GPU requirements of the algorithm in cores',
                type: 'number',
                default: 0
            },
            mem: {
                describe: "memory requirements of the algorithm. Possible units are ['Ki', 'M', 'Mi', 'Gi', 'm', 'K', 'G', 'T', 'Ti', 'P', 'Pi', 'E', 'Ei']. Minimum is 4Mi",
                type: 'string',
                default: '512Mi'
            },
        };
        yargs.options(options);

        yargs.completion();
        return yargs;
    },
    handler: async (argv) => {
        const ret = await template(argv);
        log(ret, { ...argv, printOptions: { inlineArrays: true } });
    }
};
