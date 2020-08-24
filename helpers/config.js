const findUp = require('find-up');
const fs = require('fs-extra');
const path = require('path');
const os = require('os');

const configFolder = () => {
    return path.join(os.homedir(), '.hkube');
};

const resolveConfigPath = async (createIfNotFound) => {
    const cwds = [process.cwd(), path.join(process.cwd(), '.hkube'), configFolder()];
    let configPath;
    for (const cwd of cwds) {
        configPath = findUp.sync(['.hkuberc', '.hkuberc.json'], { cwd });
        if (configPath) {
            break;
        }
    }
    if (!configPath && createIfNotFound) {
        configPath = path.join(os.homedir(), path.join('.hkube', '.hkuberc'));
        await fs.ensureFile(configPath);
        await fs.writeJson(configPath, {});
    }
    return configPath;
};

const readConfig = async () => {
    const configPath = await resolveConfigPath();
    if (!configPath) {
        return {};
    }
    try {
        const configFile = fs.readFileSync(configPath, { encoding: 'utf-8' });
        const config = JSON.parse(configFile);
        return config;
    }
    catch (error) {
        return {};
    }
};

const writeValue = async ({ key, value }) => {
    const configPath = await resolveConfigPath(true);
    const config = await fs.readJson(configPath);
    const newConfig = { ...config, [key]: value };
    await fs.writeJson(configPath, newConfig, { spaces: 2 });
    return newConfig;
};

const writeValues = async (values = {}) => {
    const configPath = await resolveConfigPath(true);
    const config = await fs.readJson(configPath);
    const newConfig = { ...config, ...values };
    await fs.writeJson(configPath, newConfig, { spaces: 2 });
    return newConfig;
};

module.exports = {
    readConfig,
    resolveConfigPath,
    configFolder,
    writeValue,
    writeValues
};
