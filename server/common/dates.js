const formatToDateVar = (date) => `datetime\'${date.toISOString().split('T')[0]}T00:00\'`

const getDateWithOffset = (n) => {
    const date = new Date();
    date.setDate(date.getDate() + n)
    
    return date;
}

module.exports = { formatToDateVar, getDateWithOffset };