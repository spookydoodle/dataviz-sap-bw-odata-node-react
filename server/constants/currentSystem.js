const systems = {
    bwd: {
        systemName: "BWD",
        server: 'abcd.com',
        port: "8000",
        credentials: process.env.USER_DEV,
    },
    bwq: {
        systemName: "BWQ",
        server: 'abcq.com',
        port: "8000",
        credentials: process.env.USER_QAS,
    },
    bwp: {
        systemName: "BWP",
        server: 'abcp.com',
        port: "8000",
        credentials: process.env.USER_PROD,
    }
}

// On dev connect to BWQ, on stage and production show productive data from BWP
let selectedSystem = systems.bwd;

switch (process.env.NODE_ENV) {
    case 'dev':
        selectedSystem = systems.bwq;
        break;
    case 'stage':
        selectedSystem = systems.bwp;
        break;
    case 'production':
        selectedSystem = systems.bwp;
}

module.exports = selectedSystem;
