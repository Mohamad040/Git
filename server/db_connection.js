const mongoose = require('mongoose');
const consts = require('./constants');
const { infoLogger, errorLogger } = require("./logs/logs");
const { DB_HOST, DB_USER, DB_PASS } = consts;
const url = DB_HOST;
const options = {
    useNewUrlParser: true, // For deprecation warnings
    useUnifiedTopology: true, // For deprecation warnings
};

mongoose
    .connect(url, options)
    .then(() => {
        infoLogger.info('DB connected');
    })
    .catch(err => {
        errorLogger.error(`connection error: ${err}`);
   });
