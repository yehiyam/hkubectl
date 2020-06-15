const axios = require('axios');
const https = require('https');
const axiosRetry = require('axios-retry');
const { promisify } = require('util');
const EventEmitter = require('events');
const { directions, events } = require('./consts');


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
        try {
            const config = await this._axios.get(`${this._baseUrl}/rest/system/ping`, {
                headers: this._headers
            });
            this.deviceID = config.headers['x-syncthing-id']
        } catch (error) {

        }
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

    async addDevice({ deviceID, name, url }) {
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
        }
    }
    async addFolder({ path, id, direction, ownerID }) {
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
        }
    }

    async getEvents(stop = () => { }) {
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
        const events = ret.data
        this._lastEventId = events ? events[events.length - 1].id : 0;
        return events;
    }



}

module.exports = SyncthingApi