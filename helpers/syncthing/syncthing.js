const EventEmitter = require('events');
const fs = require('fs-extra');
const path = require('path');
const { promisify } = require('util');
const { spawn } = require('child_process');
const stream = require('stream');
const { configFolder } = require('../config');
const { directions } = require('./consts');
const Api = require('./api');

const pipeline = promisify(stream.pipeline);

class Syncthing extends EventEmitter {
    constructor() {
        super();
        this._configDir = path.join(configFolder(), 'syncthing');
        this._binDir = path.join(configFolder(), 'syncthing', 'bin');
        this._command = path.join(this._binDir, 'syncthing')
        this._apiKey = 'hkubectl';
        this._headers = { 'X-API-KEY': this._apiKey }
    }
    async _createConfig() {
        await fs.ensureDir(this._configDir);
        await fs.ensureDir(this._binDir);
        await this._copy(path.join(__dirname, './config.xml'), path.join(this._configDir, 'config.xml'));
        await this._copy(path.join(__dirname, 'syncthing'), this._command);
        await fs.chmod(this._command, '775')
    }
    async start({ envs = {}, port = 8384, tunnelUrl, tunnelPort } = {}) {
        this._restPort = port;
        this._tunnelPort = tunnelPort;
        console.log(`starting local sync server`)
        await this._createConfig();
        this._args = ["-gui-address", `localhost:${this._restPort}`, "-gui-apikey", this._apiKey, "-home", this._configDir, "-no-browser"]
        this._proc = spawn(this._command, this._args, { env: { ...process.env, ...envs } });

        this._proc.stdout.on('data', async (d) => {
            // console.log(d.toString());
        });
        this._proc.stderr.on('data', (d) => {
            console.error(d.toString());
        });
        this._proc.on('close', (code) => {
        });
        this._proc.on('error', (err) => {
            console.error(err.message || err)
        });
        this._local = new Api({ apiKey: this._apiKey, baseUrl: `http://localhost:${this._restPort}`, name: 'local' })
        await this._local.isReady();
        console.log(`local sync server ready`)
        this._remote = new Api({ apiKey: this._apiKey, baseUrl: tunnelUrl, name: 'remote' })
        await this._remote.isReady();
        console.log(`remote sync server ready`)
        this._local.on('event', data => this.emit('event', data));
        this._remote.on('event', data => this.emit('event', data))
        this._local.getEvents();
        this._remote.getEvents();
    }
    async addFolder({ path, algorithmName, bidi }) {
        const id = algorithmName;
        const localDirection = bidi ? directions.sendreceive : directions.sendonly;
        const remoteDirection = bidi ? directions.sendreceive : directions.receiveonly;
        await this._local.addDevice({ deviceID: this._remote.deviceID, url: `tcp://localhost:${this._tunnelPort}` });
        await this._remote.addDevice({ deviceID: this._local.deviceID });
        await this._local.addFolder({ path, id, direction: localDirection, ownerID: this._remote.deviceID });
        await this._remote.addFolder({ path: `/sources/${algorithmName}`, id, direction: remoteDirection, ownerID: this._local.deviceID });
    }

    _copy(source, target) {
        if (process.pkg) {
            // use stream pipe to reduce memory usage
            // when loading a large file into memory.
            return pipeline(fs.createReadStream(source), fs.createWriteStream(target));
        } else {
            return fs.copyFile(source, target);
        }
    }
}

module.exports = new Syncthing()