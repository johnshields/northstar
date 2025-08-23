// server.js
const express = require('express');
const routes = require('./routes/apiRoutes');

require('dotenv').config();
require('./scheduler');

const ts = () => new Date().toISOString();
const info = (msg) => console.log(`[info]: ${msg}`);
const error = (msg) => console.error(`[error]: ${msg}`);

class Server {
    constructor() {
        this.app = express();
        this.host = process.env.IP || '127.0.0.1';
        this.port = Number(process.env.PORT) || 8080;
        this.server = null;
        this.startedAt = Date.now();

        this.configure();
        this.mountRoutes();
    }

    configure() {
        this.app.use(express.json());
    }

    mountRoutes() {
        this.app.use('/api', routes);

        this.app.get('/', (req, res) => {
            const uptimeSeconds = Math.floor((Date.now() - this.startedAt) / 1000);
            res.json({
                status: 'OK',
                service: 'northstar_api',
                version: '0.0.1',
                api_version: 'v1',
                timestamp: ts(),
                uptime_seconds: uptimeSeconds,
                message: 'northstar API is live...',
            });
        });
    }

    start() {
        info('northstar API booting up...');
        this.server = this.app.listen(this.port, this.host, () => {
            info(`northstar API running at http://${this.host}:${this.port}/`);
        });

        this.server.on('error', (e) => {
            error(`server error: ${e instanceof Error ? e.message : String(e)}`);
        });

        const shutdown = () => {
            info('northstar API shutting down...');
            if (!this.server) process.exit(0);
            this.server.close(() => process.exit(0));
            setTimeout(() => {
                error('forced exit after timeout');
                process.exit(1);
            }, 5000);
        };

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

// Run service
if (require.main === module) {
    new Server().start();
}

module.exports = Server;
