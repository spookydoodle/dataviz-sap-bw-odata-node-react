// This class is created to store cache of the data in server memory
// If data in the app is relatively static, there is no need to communicate between 
// BW and hosting platform each time the client app is opened.

// This class will compare the last update time with the time points provided
// as class constructor parameters, and load a fresh update if conditions are met.
// Otherwise it will provide the cached data to the client, preventing from
// redundant requests from server to the data center (BW)
class DataCache {
    // provide updateTimes as an array of elements in this format: [HH, MM, SS, MS]
    constructor(requestFunc, updateTimes) {
        this.requestFunc = requestFunc;
        this.updateTimes = updateTimes;
        this.cache = null;
        this.lastError = null;
    }

    // If now is after the updateTime and last cache data update is before the updateTime
    isCacheExpired = () => {
        let isExpired = false;
        const now = new Date().getTime();
        const lastUpdate = this.cache?.lastUpdate.getTime();
        const updateTimes = this.updateTimes.map(updateTime => new Date().setHours(...updateTime));
        updateTimes.sort((a, b) => a < b ? 1 : -1)
        
        for (let i = 0; i < updateTimes.length; i++) {
            // console.log("checking", i)
            if (now > lastUpdate && now > updateTimes[i] && lastUpdate < updateTimes[i]) {
                isExpired = true;
                break;
            }
        }

        return isExpired;
    }

    getData = () => {
        if (!this.cache || this.isCacheExpired()) {
            // console.log(new Date(), "expired");

            return this.requestFunc().then((data) => {
                // If new request results in an error, do not overwrite the cache
                if (data.status !== 200) {
                    console.log("Error getting new data");
                    this.lastError = {
                        time: new Date(),
                        message: data.send.error,
                    }

                    // If errors appear with the initial cache load, send the error message to client
                    // Set lastUpdate date to beginning, so that the server tries to request the data from the source system again
                    // with the next client request
                    if (!this.cache) {
                        this.cache = {
                            lastUpdate: new Date(0),
                            data: { status: 500, send: [{ error: data.send.error }] }
                        }
                    }
                } else {
                    console.log("Sending new data");
                    this.cache = {
                        lastUpdate: new Date(),
                        data: data,
                    }
                }
                
                return { ...this.cache, lastError: this.lastError };
            });
        } else {
            console.log(new Date(), 'cache hit');
            return Promise.resolve({ ...this.cache, lastError: this.lastError });
        }
    }

    resetCache = () => {
        this.lastUpdate = new Date(0);
    }

}


module.exports = DataCache;