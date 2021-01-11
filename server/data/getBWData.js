const logSymbols = require('log-symbols');
const { createObj } = require('./convertObj');
const { systemName } = require('../constants/currentSystem');
const fetch = require('node-fetch');
const message =
    "This API is managed by hello world. Contact abc@def.com for more information.";

const fetchOne = async (BWoData) => {
    console.log(`[${new Date().toLocaleString()}] ---> Requesting ${BWoData.name} data...`);

    const res = await fetch(BWoData.url, {
        headers: {
            // Base64 encoded usename:pass, oData class should receive credentials from process.env.abc
            Authorization: `Basic ${BWoData.credentials}`,
            'Content-Type': 'application/json',
            'x-csrf-token': 'Fetch',
            strictSSL: false,
        },
    })
        .then(async (response) => {
            if (response.status == 200) {
                console.log(
                    `[${new Date().toLocaleString()}] ${logSymbols.success} ${BWoData.name} data fetched successfully`
                );
                const csrfToken = response.headers['x-csrf-token'];

                return response.json().then((res) => ({
                    status: response.status,
                    error: null,
                    body: res.d.results?.map((resultRow) => createObj(BWoData.selections, resultRow)),
                }));
            } else if (response.status == 401) {
                console.log(
                    `[${new Date().toLocaleString()}] Error ${response.status} while fetching ${BWoData.name} data`
                );

                return response.json().then((res) => ({
                    status: response.status,
                    error: 'User does not have authorization or account locked due to incorrect logon attempts.',
                    body: res,
                }));
            } else if (response.status == 404) {
                console.log(
                    `[${new Date().toLocaleString()}]Error ${response.status} while fetching ${BWoData.name} data`
                );

                return response.json().then((res) => ({
                    status: response.status,
                    error: res?.error || 'Unauthorized',
                    body: res,
                }));
            } else {
                console.log(
                    `[${new Date().toLocaleString()}] ${logSymbols.error} Error ${response.status} while fetching ${
                        BWoData.name
                    } data`
                );

                return response.json().then((res) => ({
                    status: response.status,
                    error: 'Error fetching data',
                    body: res,
                }));
            }
        })
        .catch((error) => {
            console.log(
                `[${new Date().toLocaleString()}] ${logSymbols.error} Error while fetching ${BWoData.name} data`
            );

            return {
                status: 500,
                error,
                body: null,
            };
        });

    return res;
};

const fetchAll = async (BWoDataArr) => {
    const res = await Promise.all(BWoDataArr?.map((BWoData) => fetchOne(BWoData)))
        .then((results) => ({
            status: 200,
            error: null,
            body: results?.map((query) => query.body).flat(1),
        }))
        .catch((error) => ({
            status: 500,
            error,
            body: null,
        }));

    return res;
};


// Dimensions and measures are expected to be an object
const getFromCache = (resultsCache) => resultsCache.getData()
.then(({ lastUpdate, lastError, cache }) => ({
    message: message,
    system: systemName,
    lastUpdate: lastUpdate,
    lastError: lastError,
    status: cache !== null ? cache.status : 500,
    data: cache !== null ? cache.body : [{ error: 'Unknown error', message: 'Contact abc@def.com' }],
}))
.catch((error) => {
    console.error(error);

    return {
        message: message,
        status: 401,
        data: [{ error: 'Unauthorized' }],
    };
});

module.exports = { fetchOne, fetchAll, getFromCache };
