// server.js
const express = require('express');
const routes = require('./api');

require('dotenv').config();
require('./api/scheduler');

// Load api config
const {NAME, HOST, PORT, VERSION, API_VERSION} = require('./config');

// simple logger helpers
const ts = () => new Date().toISOString();
const info = (msg) => console.log(`[info]: ${msg}`);
const error = (msg) => console.error(`[error]: ${msg}`);

class Server {
    constructor() {
        this.app = express();
        this.host = HOST;
        this.port = PORT;
        this.server = null;
        this.startedAt = Date.now();

        this.configure();
        this.mountRoutes();
    }

    configure() {
        // middleware: parse JSON bodies
        this.app.use(express.json());
    }

    mountRoutes() {
        // mount API routes
        this.app.use('/api', routes);

        // health / info endpoint
        this.app.get('/', (req, res) => {
            const uptimeSeconds = Math.floor((Date.now() - this.startedAt) / 1000);
            res.json({
                status: 'OK',
                service: NAME,
                version: VERSION,
                api_version: API_VERSION,
                timestamp: ts(),
                uptime_seconds: uptimeSeconds,
                message: `${NAME} is live...`,
            });
        });
    }

    start() {
        // start server
        info(`${NAME} booting up...`);
        this.server = this.app.listen(this.port, this.host, () => {
            info(`${NAME} running at http://${this.host}:${this.port}/`);
        });

        this.server.on('error', (e) => {
            error(`server error: ${e instanceof Error ? e.message : String(e)}`);
        });

        // graceful shutdown handler
        const shutdown = () => {
            info(`${NAME} shutting down...`);
            if (!this.server) process.exit(0);
            this.server.close(() => process.exit(0));
            setTimeout(() => {
                error('forced exit after timeout');
                process.exit(1);
            }, 5000);
        };

        // register shutdown / error signals
        process.on('SIGINT', shutdown);
        process.on('SIGTERM', shutdown);
        process.on('uncaughtException', (e) =>
            error(`uncaught exception: ${e instanceof Error ? e.stack || e.message : String(e)}`)
        );
        process.on('unhandledRejection', (reason) =>
            error(`unhandled rejection: ${reason instanceof Error ? reason.stack || reason.message : String(reason)}`)
        );

        return this.server;
    }
}

// Run service directly
if (require.main === module) {
    new Server().start();
}

module.exports = Server;
