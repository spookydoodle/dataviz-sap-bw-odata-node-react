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
            , (error, response, body) => {
                // csrfToken should be stored in order to do post requests. Not needed in this app.
                const csrfToken = response.headers['x-csrf-token'];
                const bodyJSON = JSON.parse(body);

                if (err) {
                    res.status(500).send({ error: err, res: response, body: bodyJSON })

                } else if (response.statusCode == 200) {
                    res.status(response.statusCode)
                        .send(bodyJSON.d.results.map(resultRow => createObj(sourceJSON, resultRow)))

                } else {
                    res.status(response.statusCode).send({
                        error: bodyJSON.error.message.value ? bodyJSON.error.message.value : "Error getting the data",
                        response,
                        body: bodyJSON
                    })
                }
            });
    });
}





module.exports = getBWData;