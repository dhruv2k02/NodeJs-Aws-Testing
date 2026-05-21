const express = require('express');
const app = express();
const ip = require('ip');
const path = require('path');
const fs = require('fs');
const http = require('http');
const https = require('https');

// Ports
const PORT = process.env.PORT || 3000; // fallback HTTP port
const HTTP_PORT = process.env.HTTP_PORT || 80;
const HTTPS_PORT = process.env.HTTPS_PORT || 443;

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));

// Make the homepage explicit so the UI always loads on /
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint to return server IP (consumed by client JS if needed)
app.get('/api/ip', (req, res) => {
    res.json({ ip: ip.address() });
});

app.get('/health', (req, res) => {
    res.status(200).send('Server is healthy');
});

// HTTPS setup: use SSL_KEY_PATH and SSL_CERT_PATH env vars if provided
const sslKeyPath = process.env.SSL_KEY_PATH;
const sslCertPath = process.env.SSL_CERT_PATH;

if (sslKeyPath && sslCertPath && fs.existsSync(sslKeyPath) && fs.existsSync(sslCertPath)) {
    const options = {
        key: fs.readFileSync(sslKeyPath),
        cert: fs.readFileSync(sslCertPath),
    };

    // Start HTTPS server
    https.createServer(options, app).listen(HTTPS_PORT, '0.0.0.0', () => {
        console.log(`HTTPS server running on port ${HTTPS_PORT}`);
    });

    // Redirect HTTP -> HTTPS
    http.createServer((req, res) => {
        const host = req.headers.host ? req.headers.host.split(':')[0] : 'localhost';
        const redirectUrl = `https://${host}:${HTTPS_PORT}${req.url}`;
        res.writeHead(301, { Location: redirectUrl });
        res.end();
    }).listen(HTTP_PORT, '0.0.0.0', () => {
        console.log(`HTTP redirector running on port ${HTTP_PORT} -> redirects to HTTPS`);
    });
} else {
    // No SSL configured; start regular HTTP server on PORT
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`HTTP server running on port ${PORT}`);
    });
}