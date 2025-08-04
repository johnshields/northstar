const express = require('express');
const dotenv = require('dotenv');
const routes = require('./routes/apiRoutes');

dotenv.config();

const PORT = process.env.PORT || 8080;
const app = express();

app.use(express.json());
app.use('/api', routes);

app.get('/', (req, res) => {
    res.json({
        service: 'northstar',
        status: 'OK',
        message: 'northstar API is live...',
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log(`northstar API running on port ${PORT}`);
});
