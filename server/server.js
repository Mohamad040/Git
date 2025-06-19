const express = require("express");
const app = express();
const { authRouter } = require("./routers/authRouter");
const { infoLogger, errorLogger } = require("./logs/logs");
const { ratingsRouter } = require("./routers/ratingsRouter");
const { usersRouter } = require("./routers/usersRouter");
const { eventsRouter } = require("./routers/eventsRouter");
const { workRateRouter } = require('./routers/workRateRouter');
const authJwt = require('./middlewares/authJwt');



// Log method
app.use((req, res, next) => {
    console.log(req.method);
    next();
});

// CORS setup
const corsConfig = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,PATCH,DELETE');
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
};
app.use(corsConfig);

// Body parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api/auth', authRouter);
app.use(authJwt.verifyToken); // protect below routes
app.use('/api/users', usersRouter);
app.use('/api/ratings', ratingsRouter);
app.use('/api/events', eventsRouter);
app.use('/api/workRates', workRateRouter);
// 404 fallback
app.use((req, res) => {
    errorLogger.error(`Bad Method Request!: ${req.method} ${req.url}`);
    res.status(404).json({ message: "Bad Method Request!" });
});

// ✅ Do not call listen here — we do that in index.js
module.exports = app;