const axios = require('axios');
const yargs = require('yargs');
const https = require('https');
const axiosRetry = require('axios-retry');
const { promisify } = require('util');
const EventEmitter = require('events');
const { directions, events } = require('../consts');
const { lock } = require('../locks');

const sleep = promisify(setTimeout);
class SyncthingApi extends EventEmitter {
    constructor({ baseUrl, apiKey, rejectUnauthorized, name }) {
        super();
        this._baseUrl = baseUrl;
        this._name = name;
        this._headers = { 'X-API-KEY': apiKey }
        this._axios = axios.create({ httpsAgent: https.Agent({ rejectUnauthorized }) })
        axiosRetry(this._axios, { retries: 30, retryDelay: axiosRetry.exponentialDelay });
        this._lastEventId = 0;
    }
    async isReady() {
        const config = await this._axios.get(`${this._baseUrl}/rest/system/ping`, {
            headers: this._headers
        });
        this.deviceID = config.headers['x-syncthing-id']
    }
    async getConfig() {
        const ret = await this._axios.get(`${this._baseUrl}/rest/system/config`, {
            headers: this._headers
        });
        return ret.data;
    }
    async postConfig(config) {
        const ret = await this._axios.post(`${this._baseUrl}/rest/system/config`, config, {
            headers: this._headers,
        })
        return ret.data;
    }



    async setListenPort({ port }) {
        try {
            const currentConfig = await this.getConfig();
            currentConfig.options.listenAddresses = [`tcp://0.0.0.0:${port}`];
            await this.postConfig(currentConfig);
        } catch (error) {
            console.error(error.message || error)
        }
    }

    async addDevice({ deviceID, name, url }) {
        const unlock = await lock('addDevice');
        try {
            const currentConfig = await this.getConfig();
            currentConfig.devices = currentConfig.devices.filter(f => f.deviceID !== deviceID);
            currentConfig.devices.push({
                deviceID,
                name,
                addresses: [url]
            })
            await this.postConfig(currentConfig);
        } catch (error) {
            console.error(error.message || error)
        } finally {
            unlock();
        }
    }

    async removeDevice({ deviceID }) {
        const unlock = await lock('removeDevice');
        try {
            const currentConfig = await this.getConfig();
            currentConfig.devices = currentConfig.devices.filter(f => f.deviceID !== deviceID);
            await this.postConfig(currentConfig);
        } catch (error) {
            console.error(error.message || error)
        } finally {
            unlock();
        }
    }

    async removeFolderForDevice({ ownerID }) {
        const unlock = await lock('removeFolderForDevice');
        try {
            if (yargs.argv.verbose){
                console.log(`removing folders for device ${ownerID}`)
            }
            const currentConfig = await this.getConfig();
            const folders = currentConfig.folders.filter(f => f.devices.find(d => d.deviceID === ownerID));
            folders.forEach(f => f.devices = f.devices.filter(d => d.deviceID !== ownerID))
            const foldersToRemove = folders.filter(f => f.devices.length === 1 && f.devices[0].deviceID === this.deviceID);
            currentConfig.folders = currentConfig.folders.filter(f => !foldersToRemove.find(fr => f.id === fr.id));
            await this.postConfig(currentConfig);
        } catch (error) {
            console.error(error.message || error)
        } finally {
            unlock();
        }
    }
    async addFolder({ path, id, direction, ownerID }) {
        const unlock = await lock('addFolder');
        try {
            const ignoreDelete = direction === directions.sendonly;
            const currentConfig = await this.getConfig();
            currentConfig.folders = currentConfig.folders.filter(f => f.id !== id);
            currentConfig.folders.push({
                id,
                label: id,
                path,
                type: direction,
                ignoreDelete,
                devices: [
                    { deviceID: ownerID }
                ],
                fsWatcherEnabled: true,
                fsWatcherDelayS: 1,
                maxConflicts: 0,
                copyOwnershipFromParent: true,
            })
            await this.postConfig(currentConfig);
        } catch (error) {
            console.error(error.message || error)
        } finally {
            unlock();
        }
    }

    async getEvents() {
        const validEvents = Object.keys(events);
        while (true) {
            try {
                const events = await this._getEvents();
                events.filter(e => validEvents.includes(e.type)).forEach(e => {
                    this.emit('event', {
                        time: e.time,
                        type: e.type,
                        folder: e.data.folder,
                        name: this._name
                    })
                })
                await sleep(100);
            } catch (error) {
                console.error(error.message || error)
            }

        }
    }
    async _getEvents() {
        const ret = await this._axios.get(`${this._baseUrl}/rest/events`, {
            headers: this._headers,
            params: {
                since: this._lastEventId
            },
        });
        const events = ret.data || []
        if (events && events.length) {
            this._lastEventId = events[events.length - 1].id;
        }
        return events;
    }



}

module.exports = SyncthingApi