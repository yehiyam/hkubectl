const findUp = require('find-up');
const fs = require('fs');
const path = require('path');

const readConfig = () => {
    const cwds = [process.cwd(), path.join(process.cwd(), '/.hkube'), path.join(process.env.HOME, '/.hkube/')]
    let configPath;
    for (let cwd of cwds) {
      configPath = findUp.sync(['.hkuberc', '.hkuberc.json'], { cwd });
      if (configPath){
        break;
      }
    }
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
      readConfig
  }

