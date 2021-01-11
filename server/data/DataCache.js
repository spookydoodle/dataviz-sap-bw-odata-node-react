// This class is created to store cache of the data in server memory
// Data in this dashboard is quite static and it is enough to update it every day
// The numbers shown are representing net sales up to yesterday's date.
// Every day BW should already have received all updates for Full Price, Outlet and E-com
// by 9:00 AM. At 9:00 the daily sales reports are scheduled, with which the numbers
// in this dashboard should reconcile.
// Safely, provide two time points, when data should be updated as sometimes (rarely)
// data load issues occur in BW causing a delay with loading parts of the data

// This class will compare the last update time with the time points provided
// as class constructor parameters, and load a fresh update if conditions are met.
// Otherwise it will provide the cached data to the client, preventing from
// redundant requests from server to the data center (BW)
const logSymbols = require('log-symbols');

class DataCache {
    constructor(
        name,
        requestFunc,
        updateTimes = [[9, 0, 0, 0]],
        checkUpdateFreq = 5 * 60 * 1000,
        initDelay
    ) {
        this.name = name;
        this.requestFunc = requestFunc;
        this.updateTimes = updateTimes;
        this.checkUpdateFreq = checkUpdateFreq;
        this.initDelay = initDelay;

        this.cache = null;
        this.lastError = null;
        this.lastUpdate = null;
        this.isUpdateInProgress = false;

        // Get data while initializing and set automatic check
        // if update is needed to be executed every 'checkUpdateFreq' seconds
        this.initializeUpdates(initDelay);
    }

    setUpdateInProgress = (bool) => {
        console.log(
            `[${new Date().toLocaleString()}] ${
                bool === true
                    ? `-> Initiating data load for ${this.name}. New requests won't be sent to data center until this one is finshed.`
                    : `-> Data load process for ${this.name} finished, new data may be requested again.`
            }`
        );

        this.isUpdateInProgress = bool;
    };

    // If now is after the updateTime and last cache data update is before the updateTime
    // TODO: Add moment.js for handling this logic in a specific time zone
    isCacheExpired = () => {
        let isExpired = false;
        const now = new Date().getTime();
        const lastUpdate = this?.lastUpdate.getTime();
        const updateTimes = this.updateTimes.map((updateTime) => new Date().setHours(...updateTime));
        updateTimes.sort((a, b) => (a < b ? 1 : -1));

        for (let i = 0; i < updateTimes.length; i++) {
            if (now > lastUpdate && now > updateTimes[i] && lastUpdate < updateTimes[i]) {
                isExpired = true;
                break;
            }
        }

        return isExpired;
    };

    getCurrentCache = () =>
        Promise.resolve({ cache: this.cache, lastUpdate: this.lastUpdate, lastError: this.lastError });

    // Get data from cache, or if cache empty initiate updateCache
    getData = () => (!this.cache ? this.updateCache() : this.getCurrentCache());

    // Method called in the setAutomatic update in order to update cache at given times
    updateCache = async () => {
        console.log(`[${new Date().toLocaleString()}] Update cache for ${this.name} requested.`);

        // If one update is in progress, do not initiate another
        if ((!this.cache || this.isCacheExpired()) && !this.isUpdateInProgress) {
            console.log(
                `[${new Date().toLocaleString()}] Cache for ${this.name} ${
                    !this.cache ? 'empty' : 'expired'
                }. Updating...`
            );

            this.setUpdateInProgress(true);

            return this.requestFunc()
                .then((response) => {
                    console.log(
                        `[${new Date().toLocaleString()}] ${logSymbols.success} Cache for ${
                            this.name
                        } received new data.`
                    );

                    // If new request results in an error, do not overwrite the cache
                    if (response.status !== 200) {
                        console.log(
                            `[${new Date().toLocaleString()}] ${logSymbols.error} Error updating cache for ${
                                this.name
                            }.`
                        );

                        this.lastError = {
                            time: new Date(),
                            message: response.error,
                        };

                        // If errors appear with the initial cache load, send the error message to client
                        // Set lastUpdate date to beginning, so that the server tries to request the data from the source system again
                        // with the next client request
                        if (!this.cache) {
                            this.cache = {
                                status: response.status,
                                error: response.error,
                                body: [],
                            };
                        }
                    } else {
                        this.cache = {
                            status: response.status,
                            error: null,
                            body: response.body,
                        };

                        console.log(
                            `[${new Date().toLocaleString()}] ${logSymbols.success} Cache for ${
                                this.name
                            } updated with new data.`
                        );
                    }

                    this.lastUpdate = new Date();
                    this.setUpdateInProgress(false);

                    return { cache: this.cache, lastUpdate: this.lastUpdate, lastError: this.lastError };
                })
                .catch((error) => {
                    console.log(
                        `[${new Date().toLocaleString()}] ${logSymbols.error} Fatal error updating cache for ${
                            this.name
                        }.`
                    );
                    console.error(error);

                    return this.getCurrentCache();
                });
        } else {
            console.log(
                `[${new Date().toLocaleString()}] ${logSymbols.info} Returning existing cache for ${this.name}`
            );
            return this.getCurrentCache();
        }
    };

    resetCache = () => {
        this.lastUpdate = new Date(0);
    };

    setAutomaticUpdate = (n) => {
        const intervalText =
            n > 1000 * 60 ? `${n / 1000 / 60} minutes` : n > 1000 ? `${n / 1000} seconds` : `${n} milliseconds`;
        console.log(
            `[${new Date().toLocaleString()}] *** Data cache for ${
                this.name
            } is set and will check if it needs to update every ${intervalText}.`
        );
        console.log(
            `[${new Date().toLocaleString()}] *** Data will be updated every day at around: ${this.updateTimes
                .map((arr) => arr.join(':'))
                .join(', ')} (H:M:S:MS).`
        );

        const interval = setInterval(() => {
            this.updateCache();
        }, n);

        // clearInterval(interval);
    };

    initializeUpdates = (n) => {
        const timeout = setTimeout(() => {
            this.setAutomaticUpdate(this.checkUpdateFreq);
            this.updateCache();
        }, n || 0);

        // clearTimeout(timeout);
    };
}

module.exports = DataCache;
