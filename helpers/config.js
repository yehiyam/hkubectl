const findUp = require('find-up');
const fs = require('fs-extra')
const path = require('path');
const os = require('os');
const resolveConfigPath = async (createIfNotFound) => {
  const cwds = [process.cwd(), path.join(process.cwd(), '.hkube'), path.join(os.homedir(), '.hkube')]
  let configPath;
  for (let cwd of cwds) {
    configPath = findUp.sync(['.hkuberc', '.hkuberc.json'], { cwd });
    if (configPath) {
      break;
    }
  }
  if (!configPath && createIfNotFound) {
    configPath = path.join(os.homedir(), path.join('.hkube','.hkuberc'));
    await fs.ensureFile(configPath)
    await fs.writeJson(configPath, {});
  }
  return configPath;
}

const readConfig = async () => {
  const configPath = await resolveConfigPath();
  if (!configPath) {
    return {};
  }
  try {
    const configFile = fs.readFileSync(configPath, { encoding: 'utf-8' });
    const config = JSON.parse(configFile);
    return config;
  } catch (error) {
    return {};
  }
};

module.exports = {
  readConfig,
  resolveConfigPath
}

