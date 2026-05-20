const express = require('express');
const app = express();
const ip = require('ip');

app.get('/', (req, res) => {
    res.send('Welcome to my website\nMy device IP address is ' + ip.address());
});

app.get('/health', (req, res) => {
    res.status(200).send('Server is healthy');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});