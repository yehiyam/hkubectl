const path = require('path');
const prettyjson = require('prettyjson');
const localPipeline = require('@hkube/local-pipeline-driver');
const getHandler = async ({ port }) => {
    localPipeline.run(port)
}

module.exports = {
    command: 'start',
    description: 'srart dry run',
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
        const ret = await getHandler(argv);
        //   console.log(prettyjson.render(ret));
    }
}