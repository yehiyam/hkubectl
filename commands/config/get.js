const fs = require('fs-extra');
const { log } = require('../../helpers/output');
const { resolveConfigPath } = require('../../helpers/config');

const handler = async () => {
    const configPath = await resolveConfigPath(true);
    const config = await fs.readJson(configPath);
    return config;
};

module.exports = {
    command: 'get',
    description: 'Gets the current configuration.',
    options: {

    },
    builder: {},
    handler: async (argv) => {
        const ret = await handler(argv);
        log(ret, argv);
    }
};
