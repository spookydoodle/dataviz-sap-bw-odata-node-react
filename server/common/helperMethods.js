// Convert 2 level object to 1 level flat array
const flatten = obj => Object.keys(obj).map(el => Object.values(obj[el])).flat()

// Reflect the structure of {...dimensions, ...measures} variable:
// { colName: { prop1: '', prop2: '' }, ...rest }
// {...dimensions, ...measures} carries tech names of sourceJSON from BW query.
// Replace the tech names with values retrieved from the oData query
// Convert all values to float
const createObj = (sourceRow, resultRow) =>
    Object.fromEntries(Object.keys(sourceRow).map(colName =>
        [
            colName,
            Object.fromEntries(Object.keys(sourceRow[colName]).map(prop => {
                let val = resultRow[sourceRow[colName][prop]];
                return [prop, prop === 'value' ? parseFloat(val) : val];
            }))
        ]
    ))

module.exports = { createObj, flatten };