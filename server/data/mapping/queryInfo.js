const queryInfo = {
    service: 'T_ODATA_SRV',
    query: 'T_ODATA',
    variables: {
        date: 'VAR_DATE',
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
}

module.exports = queryInfo;