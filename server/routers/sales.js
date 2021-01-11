/* 
  The getBWData method pulls data from source system SAP BW and caches it in memory
  Data is first requested from cache. If cache is not available, then from the source system
  The cache class updates data three times a day. See /src/data/DataCache.js
  The method receives an array of queries and joins the output together so that the client
  makes less requests which browsers can handle simultaneously 
*/

const express = require('express');
const { fetchAll, getFromCache } = require('../data/getBWData');
const { updateTimes, checkUpdateFreq } = require('../constants/updateTimes');
const DataCache = require('../data/DataCache');
const { query } = require('../data/generateURLs');

// Define a router for sales
const router = express.Router();

const routeDefinitions = [
    {
        path: '/countries',
        name: 'Countries',
        BWoDataArr: [query].map(el => el.countries),
    },
    {
        path: '/divisions',
        name: 'Divisions',
        BWoDataArr: [query].map(el => el.divisions),
    },
    {
        path: '/periods',
        name: 'Fiscal Periods',
        BWoDataArr: [query].map(el => el.periods),
    },
];

// Add base path for all above paths
const baseUrl = '/sales';

// All above requests follow exactly the same logic
routeDefinitions.forEach(async ({ path, name, BWoDataArr }, i) => {
    // Initialize Data Cache for route
    // Delay each request so that one query is not executed several times 
    // in exactly the same moment (SAP BW tend to have performance issues)
    const resultsCache = new DataCache(name, () => fetchAll(BWoDataArr), updateTimes, checkUpdateFreq, 1000 * 10 * i);

    // Create Get request route
    router.get(`${baseUrl}${path}`, async (req, res) => {
        const response = await getFromCache(resultsCache);

        res.status(response.status).send(response);
    });
});

// Hello route
router.get('/', (req, res) => {
    res.status(200).send(`
    <h1>Hello from BW API.</h1>
    <p>Contact us via abc@def.com</p>
    `);
});

module.exports = router;
