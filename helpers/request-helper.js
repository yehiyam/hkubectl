const request = require('request-promise');
const { URL } = require('url');
const {getError} = require('./error-helper');
const uriBuilder = ({ endpoint, path, qs = {} }) => {
    const url = new URL(path, endpoint);
    Object.entries(qs).forEach(([k, v]) => {
        url.searchParams.append(k, v);
    });
    return url;
}

const del = async ({ endpoint, rejectUnauthorized, path, qs }) => {

    console.log(`connecting to ${endpoint}`);
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

    console.log(`connecting to ${endpoint}`);
    const uri = uriBuilder({ endpoint, path, qs });
    try {
        return await request({
            method: 'GET',
            uri,
            rejectUnauthorized,
            json: true
        });
    }
    catch (error) {
        return getError(error);
    }
};

const post = async ({ endpoint, rejectUnauthorized, path, qs, body }) => {
    console.log(`connecting to ${endpoint}`);
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
const put = async ({ endpoint, rejectUnauthorized, path, qs, body }) => {
    console.log(`connecting to ${endpoint}`);
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
    put,
    del
}