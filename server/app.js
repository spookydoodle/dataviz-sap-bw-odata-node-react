// This file exposes the whole app as a library.
//
// It *does not* connect the app to the real world. All external clients should
// be injectable / configurable from the outside to make testing possible.
// For example, the library does not connect to the database - it depends on
// the caller initializing the connection. This allows using a different connection
// in unit tests, and a different one in a production environment.
const express = require('express');
const { config } = require('./common/config');
const healthRouter = require('./routers/health');
const salesRouter = require('./routers/sales');

const app = express();

// Define main router
const indexRouter = express.Router();

// Define hello page for index - should be available for health checks on ALB
indexRouter.get('/', (req, res) => {
    res.status(200).send(`
    <h1>Hello from BW Node.js server.</h1>
    <p>Contact us via abc@def.com</p>
    `);
});

// Health page displays info about uptime and connection to the data center (SAP BW / SAP HANA BW)
indexRouter.use(config.baseUrl.health, healthRouter);

// Sales routes used in the Retail Flash application - connect to SAP BW via oData
indexRouter.use(config.baseUrl.api, salesRouter);

// Configure router to be based on a path where it's deployed
// Example: ALB listeners on AWS EC2 could have a rule defined for path '/bw*', app is hosted on example.com/bw
app.use(config.baseUrl.index, indexRouter);

module.exports = app;
