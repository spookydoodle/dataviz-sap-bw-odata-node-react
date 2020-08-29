const request = require('request')
const { createObj, flatten } = require('./helperMethods');
const generateData = require('./sap_constants/generateData');

// Dimensions and measures are expected to be an object
const getBWData = (
    app,
    path,                       // server api path
    oDataURL,                   // oData URL to SAP gateway
    credentials = undefined,    // Base64 encoded string: 'BWUserID:password'
    dimensions = {},            // provide in format { dim: { key: "key_value", text: "text_value" }, }
    measures = {},              // provide in format { dim: { value: value, unit: "unit_value" }, }
) => {

    // TODO: generate oDataURL here based on URL parameters from 'path'
    const sourceJSON = { ...dimensions, ...measures };

    return app.get(path, (req, res) => {

        request({
            url: oDataURL.url,
            headers: {
                "Authorization": `Basic ${process.env.BWCREDENTIALS || credentials}`, // Base64 encoded "username:pass"
                "Content-Type": "application/json",
                "x-csrf-token": "Fetch"
            }
        }
            , (err, response, body) => {
                let csrfToken = undefined;

                // If wrong url provided, fill API with dummy data for demo purposes
                if (err && err.code === "ENOTFOUND") {
                    res.status(200).send({ info: "This is dummy data for demo purposes", results: generateData(20) })
                    
                } else if (response.statusCode == 200) {
                    csrfToken = response.headers['x-csrf-token']; // csrfToken should be stored in order to do post requests. Not needed in this app.
                    res.status(response.statusCode)
                        .send(JSON.parse(body).d.results.map(resultRow => createObj(sourceJSON, resultRow)))

                    // Either wrong username or password or account locked after providing a wrong password more than three times
                } else if (response.statusCode == 401) {
                    res.status(response.statusCode).send({
                        error: "User does not have authorization or account locked due to incorrect logon attempts.",
                        response: response,
                        body: body
                    })
                    // Bad requests such as requesting a non existing column or misspelled technical name, wrong value passed in query string
                } else if (response.statusCode == 404) {
                    res.status(response.statusCode).send({
                        error: JSON.parse(body).error ? JSON.parse(body).error.message.value : "Bad request",
                        response: response,
                        body: body
                    })

                } else {
                    res.status(response.statusCode).send({
                        error: "Error getting the data",
                        response,
                        body: body
                    })
                }
            });
    });
}


module.exports = getBWData;