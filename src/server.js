const express = require('express');
const dotenv = require('dotenv');
const routes = require('./routes/apiRoutes');
require('./scheduler');

dotenv.config();

// App setup
const app = express();
const PORT = process.env.PORT || 8080;
app.use(express.json());
app.use('/api', routes);

// Load balancer route
app.get('/', (req, res) => {
    res.json({
        service: 'northstar',
        status: 'OK',
        message: 'northstar API is live...',
        timestamp: new Date().toISOString()
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`northstar API running on port ${PORT}`);
});
