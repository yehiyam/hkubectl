const localPipeline = require('@hkube/local-pipeline-driver');
const getHandler = async ({ port }) => {
    localPipeline.run(port);
};

module.exports = {
    command: 'start',
    description: 'start dry run',
    options: {
    },
    builder: {
        port: {
            demandOption: false,
            describe: 'port for starting dry run server',
            type: 'string',
            alias: ['p']
        },
    },
    handler: async (argv) => {
        await getHandler(argv);
    }
};
