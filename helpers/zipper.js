const archiver = require('archiver');
const tempy = require('tempy');
const fs = require('fs-extra');
const zipDirectory = (source, out, options) => {
    if (!options && typeof out === 'object') {
        options = out;
    }
    if (!options) {
        options = {};
    }
    const archive = archiver('zip', { zlib: { level: 9 } });
    const zipName = options.tmpFile ? tempy.file({ extension: 'zip' }) : out;

    const stream = fs.createWriteStream(zipName);

    return new Promise((resolve, reject) => {
        archive
            .directory(source, false)
            .on('error', err => reject(err))
            .pipe(stream)
            ;

        stream.on('close', () => resolve(zipName));
        archive.finalize();
    });
}

module.exports = {
    zipDirectory
}