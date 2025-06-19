require('dotenv').config();
require('./db_connection'); // make sure DB is initialized

const app = require('./server');
const { infoLogger } = require('./logs/logs');

const port = process.env.PORT || 8000;
app.listen(port, () => {
    infoLogger.info(`Express server is running on port ${port}`);
});
