const systems = {
    BWD: {
        server: 'http://abcd.com:8000',
        service: '/sap/opu/odata/sap/T_ODATA_SRV/$metadata',
    },
    BWQ: {
        server: 'http://abcq.com:8000',
        service: '/sap/opu/odata/sap/T_ODATA_SRV/$metadata',
    },
    BWP: {
        server: 'http://abcp.com:8000',
        service: '/sap/opu/odata/sap/T_ODATA_SRV/$metadata',
    },
};

module.exports = systems;
