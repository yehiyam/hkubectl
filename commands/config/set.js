const path = require('path')
const prettyjson = require('prettyjson');
const fs = require('fs-extra');
const { resolveConfigPath } = require('../../helpers/config');

const handler = async ({ key, value }) => {
    const configPath = await resolveConfigPath(true);
    const config = await fs.readJson(configPath);
    const newValue = _resolveValue({ key, value });
    const newConfig = { ...config, [key]: newValue };
    await fs.writeJson(configPath, newConfig, { spaces: 2 });
    return newConfig;
}

const _resolveValue = ({ key, value }) => {
    if (key === 'endpoint') {
        value = path.join(value, '/hkube/api-server/');
    }
    return value;
}

module.exports = {
    command: 'set [key] [value]',
    description: 'Sets configuration options.',
    options: {

    },
    builder: {},
    handler: async (argv) => {
        const ret = await handler(argv);
        console.log(prettyjson.render(ret));
    }
}
