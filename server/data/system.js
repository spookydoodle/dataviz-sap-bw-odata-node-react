const systems = {
    bwd: {
        server: 'abcd.com',
        port: "8000",
        credentials: process.env.USER_DEV,
    },
    bwq: {
        server: 'abcq.com',
        port: "8000",
        credentials: process.env.USER_QAS,
    },
    bwp: {
        server: 'abcp.com',
        port: "8000",
        credentials: process.env.USER_PROD,
    }
}

module.exports = { ...systems.bwp }