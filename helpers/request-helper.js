const request = require('request-promise');
const { URL } = require('url');
const { getError } = require('./error-helper');

const uriBuilder = ({ endpoint, path, qs = {} }) => {
    const url = new URL(path, endpoint);
    Object.entries(qs).forEach(([k, v]) => {
        url.searchParams.append(k, v);
    });
    return url;
}

const del = async ({ endpoint, rejectUnauthorized, path, qs }) => {
    const uri = uriBuilder({ endpoint, path, qs });
    try {
        return await request({
            method: 'DELETE',
            uri,
            rejectUnauthorized,
            json: true
        });
    }
    catch (error) {
        return getError(error);
    }
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
    const uri = uriBuilder({ endpoint, path, qs });
    try {
        return await request({
            method: 'POST',
            json: true,
            uri,
            rejectUnauthorized,
            body
        });
    }
    catch (error) {
        return getError(error);
    }
}

const postFile = async ({ endpoint, rejectUnauthorized, path, qs, formData }) => {
    const uri = uriBuilder({ endpoint, path, qs });
    try {
        return await request({
            method: 'POST',
            uri,
            rejectUnauthorized,
            formData
        });
    }
    catch (error) {
        return getError(error);
    }
}

const put = async ({ endpoint, rejectUnauthorized, path, qs, body }) => {
    const uri = uriBuilder({ endpoint, path, qs });
    try {
        return await request({
            method: 'PUT',
            json: true,
            uri,
            rejectUnauthorized,
            body
        });
    }
    catch (error) {
        return getError(error);
    }
}

module.exports = {
    get,
    post,
    postFile,
    put,
    del
}