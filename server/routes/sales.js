const getBWData = require('../data/getBWData');
const { query } = require('../data/generateURLs');

// The getBWData method pulls data from source system SAP BW and caches it in memory
// Data is first requested from cache. If cache is not available, then from the source system
// The cache class updates the data three times a day. See /src/data/DataCache.js
// The method receives an array of queries and joins the output together so that the client 
// makes less requests which browsers can handle simultaneously
const routes = app => {
    getBWData(app, '/api/sales/countries', [query].map(el => el.countries));
    getBWData(app, '/api/sales/divisions', [query].map(el => el.kpis));
    getBWData(app, '/api/sales/periods', [query].map(el => el.periods));
}


module.exports = routes;