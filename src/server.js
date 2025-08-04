const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
app.use(express.json());

// Load balancer
app.get('/', (req, res) => {
    res.json({
        service: 'NorthStar',
        status: 'OK',
        message: 'NorthStar API is live...',
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log(`NorthStar API running on port ${PORT}`);
});
