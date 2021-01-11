// At what time of the day should the data cache update itself
const updateTimes = [
    [6, 30, 0, 0],
    [7, 30, 0, 0],
    [8, 30, 0, 0],
    [9, 30, 0, 0],
    [10, 30, 0, 0],
    [11, 30, 0, 0],
    [15, 30, 0, 0],
];

// How often will server check whether it should update its cache (in ms)
const checkUpdateFreq = 5 * 60 * 1000;

const getUTCNow = () => `${new Date().toUTCString()}`;

module.exports = { updateTimes, checkUpdateFreq, getUTCNow };
