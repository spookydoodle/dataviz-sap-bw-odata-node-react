const request = require('request')
const oDataURL = require('../common/oDataURL');
const { flatten } = require('../common/helperMethods');
const getBWData = require('../common/getBWData');
const queryInfo = require('../common/sap_constants/queryInfo');
const credentials = require('../common/sap_constants/credentials');
const { server, port, service, query, variables, dimensions, measures } = queryInfo.sales;

// 'dimensions' are in format { name : { key: <BW_TECH_NAME>, text: <BW_TECH_NAME> } }
const {
    country,
    division,
    period,
} = dimensions;

// 'measures' are in format { name : { value: <BW_TECH_NAME>, unit: <BW_TECH_NAME> } }
const {
    qty,
    sales,
} = measures;

// TODO: move to getBWData and make use of params
const URL = new oDataURL(server, port, service, query)
    .setVariable(variables.country, '\'DE\'')
    .select([...flatten({ division }), ...flatten({ qty, sales })])
    .filter(period.key, ['001.2018'])   // TODO: pass filtering criteria in params
    .orderBy(division.key, 'asc')
    

console.log(URL.url)

const routes = app => {
    getBWData(
        app,
        '/api/sales',
        URL,
        credentials,
        { division },
        { qty, sales }
    );
}


module.exports = routes;