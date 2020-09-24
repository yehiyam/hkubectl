const jsyaml = require('js-yaml');

const definition = ({ name, env, cpu, gpu, mem, entryFile }) => {
    const def = {
        name,
        env,
        baseImage: 'node:14.5.0-slim',
        resources: {
            cpu,
            gpu,
            mem
        },
        code: {
            path: './',
            entryPoint: entryFile
        },
        algorithmEnv: {
            KEY: 'VALUE'
        }
    };
    let yaml = jsyaml.dump(def);
    yaml = yaml.replace('baseImage:', '# baseImage:');
    return yaml;
};

module.exports = definition;
