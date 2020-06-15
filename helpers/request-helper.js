const pathLib = require('path');
const axios = require('axios').default;
const https = require('https');
const { URL } = require('url');
const { getError } = require('./error-helper');
const apiPrefix = 'api/v1/';
const apiServerPrefix = '/hkube/api-server/';

const uriBuilder = ({ endpoint, path, qs = {} }) => {
    const endpointUrl = new URL(endpoint);
    let prefix = apiPrefix;
    if (endpointUrl.hostname !== 'localhost' && endpointUrl.hostname !== '127.0.0.1') {
        prefix = pathLib.join('/hkube/api-server/', prefix);
    }
    const fullPath = pathLib.join(prefix, path);
    const url = new URL(fullPath, endpoint);
    Object.entries(qs).forEach(([k, v]) => {
        url.searchParams.append(k, v);
    });
    return url.toString();
}

const _request = async ({ endpoint, rejectUnauthorized, path, method, body, formData, qs }) => {
    const url = uriBuilder({ endpoint, path, qs });
    let result, error;
    try {
        result = await axios({
            method,
            url,
            httpsAgent: https.Agent({ rejectUnauthorized }),
            json: true,
            body,
            formData
        });
    }
    catch (e) {
        error = getError(e);
    }
    return { error, result: result.data };
};

const del = async ({ endpoint, rejectUnauthorized, path, qs }) => {
    return _request({ endpoint, rejectUnauthorized, path, qs, method: 'DELETE' });
};

const get = async ({ endpoint, rejectUnauthorized, path, qs }) => {
    const url = uriBuilder({ endpoint, path, qs });
    let result, error;
    try {
        result = await axios({
            method: 'GET',
            url,
            httpsAgent: https.Agent({ rejectUnauthorized }),
            json: true
        });
    }
    catch (e) {
        error = getError(e);
    }
    return { error, result: result.data };
};

const post = async ({ endpoint, rejectUnauthorized, path, qs, body }) => {
    return _request({ endpoint, rejectUnauthorized, path, qs, body, method: 'POST' });
}

const postFile = async ({ endpoint, rejectUnauthorized, path, qs, formData }) => {
    return _request({ endpoint, rejectUnauthorized, path, qs, formData, method: 'POST' });
}

const put = async ({ endpoint, rejectUnauthorized, path, qs, body }) => {
    return _request({ endpoint, rejectUnauthorized, path, qs, body, method: 'PUT' });
}


const putFile = async ({ endpoint, rejectUnauthorized, path, qs, formData }) => {
    return _request({ endpoint, rejectUnauthorized, path, qs, formData, method: 'PUT' });
}

module.exports = {
    get,
    post,
    postFile,
    put,
    putFile,
    del
}