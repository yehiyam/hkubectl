const path = require('path');
const prettyjson = require('prettyjson');
const fs = require('fs-extra')
const { resolveConfigPath } = require('../../helpers/config');

const handler = async ({ key, value }) => {
    const configPath = await resolveConfigPath(true);
    const config = await fs.readJson(configPath);
    return config;
}



module.exports = {
    command: 'get',
    description: 'Gets the current configuration.',
    options: {

    },
    builder: {},
    handler: async (argv) => {
        const ret = await handler(argv);
        console.log(prettyjson.render(ret));
    }
}
//https://40.69.222.75/hkube/api-server/loca