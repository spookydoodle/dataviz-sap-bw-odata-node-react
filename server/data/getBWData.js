const request = require('request');
const { createObj } = require('./convertObj');
const DataCache = require('../data/DataCache');


// Dimensions and measures are expected to be an object
const getBWData = (
    app,
    path,               // server api path
    oDataURLs,          // An array with oData URLs to SAP gateway. 
) => {

    const requestFunc = () => Promise.all(oDataURLs.map((oDataURL, i) => promiseRequest(oDataURL)))
        .then(results => ({ status: 200, send: results.map(resultSet => resultSet.send.body).flat() }))
        .catch(errors => errors)


    const resultsCache = new DataCache(requestFunc, [[6, 0, 0, 1], [7, 0, 0, 0], [8, 30, 0, 0], [12, 0, 0, 0], [18, 0, 0, 0]]);

    return app.get(path, (req, res) => (
        resultsCache.getData()
            .then(results => {
                res.status(results?.data?.status)
                    .send({ 
                        lastUpdate: results?.lastUpdate, 
                        data: results?.data?.send,
                        lastError: results?.lastError,
                    })
            })
    ));
}


const promiseRequest = (oDataURL) => new Promise((resolve, reject) => {
    request({
        url: oDataURL.url,
        headers: {
            // Base64 encoded usename:pass
            "Authorization": `Basic ${oDataURL.credentials}`,
            "Content-Type": "application/json",
            "x-csrf-token": "Fetch"
        }

    }, (error, response, body) => {

        if (error) {
            console.log(`Error by getting ${oDataURL.name}`);
            reject(({
                status: 500,
                send: { error, response, body }
            }))

        } else if (response.statusCode == 200) {
            csrfToken = response.headers['x-csrf-token'];
            console.log(`Success getting ${oDataURL.name}`);

            resolve({
                status: 200,
                send: {
                    error,
                    response,
                    body: JSON.parse(body).d.results.map(resultRow => createObj(oDataURL.selections, resultRow))
                }
            })

        } else if (response.statusCode == 401) {
            console.log(`Error 401 by getting ${oDataURL.name}`);
            reject(({
                status: response.statusCode,
                send: {
                    error: "User does not have authorization or account locked due to incorrect logon attempts.",
                    response,
                    body,
                },
            }))
        } else if (response.statusCode == 404) {
            console.log(`Error 404 by getting ${oDataURL.name}`);
            reject(({
                status: response.statusCode,
                send: {
                    error: JSON.parse(body).error ? JSON.parse(body).error.message.value : "Bad request",
                    response,
                    body,
                }
            }))
        } else {
            console.log(`Error ${response.statusCode} by getting ${oDataURL.name}`);
            reject(({
                status: response.statusCode,
                send: {
                    error: "Error getting the data",
                    response,
                    body,
                },
            }))
        }
    });
});



module.exports = getBWData;