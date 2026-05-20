const express = require('express');
const app = express();
const ip = require('ip');
const path = require('path');

const PORT = process.env.PORT || 3000;

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint to return server IP (consumed by client JS if needed)
app.get('/api/ip', (req, res) => {
    res.json({ ip: ip.address() });
});

app.get('/health', (req, res) => {
    res.status(200).send('Server is healthy');
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});