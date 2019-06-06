const pathLib = require('path');
const request = require('request-promise');
const { URL } = require('url');
const { getError } = require('./error-helper');
const prefix = 'api/v1/';

const uriBuilder = ({ endpoint, path, qs = {} }) => {
    const fullPath = pathLib.join(prefix, path);
    const url = new URL(fullPath, endpoint);
    Object.entries(qs).forEach(([k, v]) => {
        url.searchParams.append(k, v);
    });
    return url;
}

const _request = async ({ endpoint, rejectUnauthorized, path, method, body, formData, qs }) => {
    const uri = uriBuilder({ endpoint, path, qs });
    let result, error;
    try {
        result = await request({
            method,
            uri,
            rejectUnauthorized,
            json: true,
            body,
            formData
        });
    }
    catch (e) {
        error = getError(e.error);
    }
    return { error, result };
};

const del = async ({ endpoint, rejectUnauthorized, path, qs }) => {
    return _request({ endpoint, rejectUnauthorized, path, qs, method: 'DELETE' });
};

const get = async ({ endpoint, rejectUnauthorized, path, qs }) => {
    const uri = uriBuilder({ endpoint, path, qs });
    let result, error;
    try {
        result = await request({
            method: 'GET',
            uri,
            rejectUnauthorized,
            json: true
        });
    }
    catch (e) {
        error = getError(e.error);
    }
    return { error, result };
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