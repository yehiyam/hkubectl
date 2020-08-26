const { get, post } = require('../../../helpers/request-helper');
const { log } = require('../../../helpers/output');

const getHandler = async ({ endpoint, rejectUnauthorized, name, verbose, setCurrent, force }) => {
    let ret;
    if (setCurrent) {
        const path = 'versions/algorithms/apply';
        ret = await post({
            endpoint,
            rejectUnauthorized,
            path,
            body: {
                name,
                image: setCurrent,
                force: !!force
            }
        });
        if (verbose) {
            return ret;
        }
        return ret.error ? ret.error : { version: ret.result.algorithmImage };
    }
    const path = `versions/algorithms/${name}`;
    ret = await get({
        endpoint,
        rejectUnauthorized,
        path
    });
    if (verbose) {
        return ret;
    }
    return { name, versions: ret.result.map(r => r.algorithmImage) };
};

module.exports = {
    command: 'version <name>',
    description: 'Gets versions of algorithm',

    builder: yargs => {
        yargs.positional('name', {
            demandOption: 'Please provide the algorithm name',
            describe: 'The name of the algorithm',
            type: 'string'
        });
        const options = {
            setCurrent: {
                describe: 'Sets the current version',
                type: 'string',
                alias: ['set']
            },
            force: {
                describe: 'If true forces the change of the version (might stop running pipelines)',
                type: 'boolean'
            }
        };
        yargs.options(options);
    },
    handler: async (argv) => {
        const ret = await getHandler(argv);
        log(ret, argv);
    }
};
