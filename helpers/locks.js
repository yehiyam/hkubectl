const lockfile = require('proper-lockfile');
const path = require('path');
const fs = require('fs-extra');
const yargs = require('yargs');
const { configFolder } = require('./config');
let lockFile;
let verbose;
const init = async () => {
    if (lockFile) {
        return;
    }
    lockFile = path.join(configFolder(), 'lockfile');
    await fs.ensureFile(lockFile);
    verbose = yargs.argv.verbose;
};
const lock = async (name = '') => {
    await init();
    if (verbose) {
        console.log(`lock ${name}`);
    }
    const unlock = await lockfile.lock(lockFile, { retries: 10 });
    if (verbose) {
        return () => {
            console.log(`unlock ${name}`); unlock();
        };
    }
    return unlock;
};

module.exports = {
    lock,
};
