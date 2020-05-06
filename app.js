const optimizelySDK = require('@optimizely/optimizely-sdk');

const {v4: uuidv4 } = require('uuid');      // import a plugin for uuid creation

// define a custom logging function
const logMe = (message) => {
    console.log(`[CUSTOM LOG] ${message}`);
};

// create logger object and set the log level
optimizelySDK.setLogger(optimizelySDK.logging.createLogger());
optimizelySDK.setLogLevel('debug');

const sdkKey = '<SDK key>' 

const optimizelyClientInstance = optimizelySDK.createInstance({
    sdkKey,
    datafileOptions: {
        autoUpdate: true,
        updateInterval: 30000,  // 30 seconds in milliseconds
        urlTemplate: 'https://cdn.optimizely.com/datafiles/%s.json',
    },
    eventBatchSize: 1,          // max number of events to hold in the queue
    eventFlushInterval: 5000   // max duration an event can exist in the queue; 5 seconds in milliseconds
});

const userId = uuidv4();    // create a single uuid OR

// provide attributes as needed
const attributes = {
    attr_key: 'attribute value'
};

optimizelyClientInstance.onReady({ timeout: 3000 }).then((result) => {
    if (result.success === false) {
        logMe(`Failed to initialize the client instance. Reason: ${result.reason}`);
        process.exit()      // exit the app
    }
    
    // if we make it here, the assumption is all is well at this point
    logMe(`Datafile ready: ${result.success}`);
    
    optimizelyClientInstance.isFeatureEnabled('<feature key>', userId);
    // track an event
    optimizelyClientInstance.track('<event key>', userId, attributes);

    optimizelyClientInstance.close().then((result) => {
        if (result.success === false) {
            logMe(`Failed to close the client instance. Reason: ${result.reason}`);
        } else {
            logMe(`Safe to close the app: ${result.success}. Closing the app!`);
            process.exit()      // exit the app
        }
    });
});