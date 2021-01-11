const express = require('express');
const { checkAllConnections } = require('../data/checkConnection');

// Define a router for health
const router = express.Router();

// Health check
// 1. Check if node.js app is running
// 2. Check if SAP BW connections are successful
router.get('/', async (req, res) => {
    // Try requesting data from BW
    const sysRes = await checkAllConnections();

    // Construct health check json
    const healthcheck = {
        timestamp: Date.now(),
        uptime: process.uptime(),
        node: {
            status: 'OK',
            message: 'Node.js server runing',
        },
        ...sysRes,
    };

    // Return health check statuses
    try {
        res.status(200).send(healthcheck);
    } catch (err) {
        healthcheck.message = err;
        res.status(503).send();
    }
});

module.exports = router;
