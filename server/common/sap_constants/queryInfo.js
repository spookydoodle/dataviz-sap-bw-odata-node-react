const queryInfo = {
    sales: {
        server: 'abc.def.com',
        port:  '1000',
        service: 'T_ODATA_SRV',
        query: 'T_ODATA',
        variables: {
            country: 'VAR_COUNTRY',
        },
        dimensions: {
            country: {
                key: "0COUNTRY",
                text: "0COUNTRY_T",
            },
            division: {
                key: "0MATERIAL__0DIVISION",
                text: "0MATERIAL__0DIVISION_T",
            },
            period: {
                key: '0FISCPER',
                text: '0FISCPER_T',
            },
        },
        measures: {
            qty: {
                value: "AAAABBBBCCCCDDDDEEEEFFFF1",
            },
            sales: {
                value: "A0AMOUNT",
                unit: "A0AMOUNT_E",
            },
        },
    },
}

module.exports = queryInfo;