const systems = require('../constants/systems');
const { BWD, BWQ, BWP } = systems;
const fetch = require('node-fetch');

// Network settings on hosting platform might enable only selected systems to connect, you can set this up here
let systemsInfo = {};
switch (process.env.NODE_ENV) {
    case 'dev':
        systemsInfo = { BWD, BWQ, HBD, HBQ };
        break;
    case 'stage':
        systemsInfo = { BWQ, BWP };
        break;
    case 'production':
        systemsInfo = { BWP };
}

// Check all connections
const checkAllConnections = async () => {
    const res = await Promise.all(Object.values(systemsInfo).map((system) => checkOneConnection(system)));
    const resObj = {};

    // Remap responses to the appropriate system key
    Object.keys(systemsInfo).forEach((system, i) => {
        resObj[system] = res[i];
    });

    return resObj;
};

// Check connection to source system
const checkOneConnection = async (system) =>
    fetch(`${system.server}${system.service}`, {
        headers: {
            // Base64 encoded usename:pass, oData class should receive credentials from process.env.abc
            Authorization: `Basic ${credentials}`,
            'Content-Type': 'application/json',
            'x-csrf-token': 'Fetch',
            strictSSL: false,
        },
    })
        .then((response) =>
            response.status === 200
                ? { status: 'OK', message: `Successfully connected to ${system.server}` }
                : {
                      status: 'Failed',
                      message: `Connection to ${system.server} returned status ${response.status}`,
                  }
        )
        .catch((error) => ({
            status: 'Failed',
            message: `Error: Could not connect to ${system.server}`,
            error: error,
        }));

module.exports = { checkOneConnection, checkAllConnections };
