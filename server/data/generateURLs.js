const BWoData = require('./BWoData');
const { formatToDateVar, getDateWithOffset } = require('../common/dates');
const queryInfo = require('./mapping/queryInfo');
const { server, port, credentials } = require('../constants/currentSystem');

const yesterdayVar = formatToDateVar(getDateWithOffset(-1));

const getURLs = (name, queryInfo) => {
    const { service, query, variables, dimensions, measures } = queryInfo;

    // 'dimensions' are in format { name : { key: <BW_TECH_NAME>, text: <BW_TECH_NAME> } }
    const { country, division, period } = dimensions;

    // 'measures' are in format { name : { value: <BW_TECH_NAME>, unit: <BW_TECH_NAME> } }
    const { qty, sales } = measures;

    // Get sales and quantity by countries, divisions and fiscal periods
    const countries = new BWoData(`Main KPI's ${name}`, server, port, service, query, credentials)
        .setVariable(variables.date, yesterdayVar)
        .select({ country, sales, qty })
        .filter(period.key, ["001.2020", "002.2020", "003.2020"])
        .orderBy(qty.value, 'desc')
        .setTop(1000);

    const divisions = new BWoData(`Sites ${name}`, server, port, service, query, credentials)
        .setVariable(variables.date, yesterdayVar)
        .select({ division, sales, qty })
        .filter(period.key, ["001.2020", "002.2020", "003.2020"])
        .orderBy(sales.value, 'desc')
        .setTop(1000);

    const periods = new BWoData(`Management Countries ${name}`, server, port, service, query, credentials)
        .setVariable(variables.date, yesterdayVar)
        .select({ period, sales, qty })
        .orderBy(period.key, 'asc')
        .setTop(1000);


    return {
        countries,
        divisions,
        periods
    }
}


module.exports = {
    query: getURLs("Query 1", queryInfo),
};