const request = require('request')
const { createObj, flatten } = require('./helperMethods');
const dummyData = require('./sap_constants/dummyData');

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
                // Get cookies token from req params and pass to request
                const csrfToken = response ? response.headers['x-csrf-token'] : null;

                // Below checks need to handle
                // - Wrong username and password
                // - Locked username and password
                // - Errors from oData, e.g. filtering by wrong dimension etc
                //
                // TODO: Proper errror handling needs to be assured here
                if (error) {
                    // If URL is not found, for demo purposes send a JSON with dummy data (you may delete this in your app)
                    error.code === "ENOTFOUND" ?
                        res.status(200).send({ info: "This is dummy data for demo purposes", results: dummyData(20) })
                        : res.status(500).send({ error: "Error retrieving data", message: error })
                } else if (response.statusCode == 200) {
                    if (csrfToken) {
                        const results = JSON.parse(body).d.results;
                        const finalResults = results.map(resultRow => createObj(sourceJSON, resultRow))

                        res.status(response.statusCode).send({info: "This is real data from SAP BW", results: finalResults })

                    } else {
                        res.status(401).json({ error: "Authentication error", message: body })
                    }
                } else {
                    res.status(500).send({ error: "Unknown error", message: body })
                }
            });
    });
}





module.exports = getBWData;