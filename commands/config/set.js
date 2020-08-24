const { log } = require('../../helpers/output');
const { writeValue } = require('../../helpers/config');

const handler = async ({ key, value }) => {
    return writeValue({ key, value });
};

module.exports = {
    command: 'set [key] [value]',
    description: 'Sets configuration options.',
    options: {

    },
    builder: {},
    handler: async (argv) => {
        const ret = await handler(argv);
        log(ret);
    }
};
