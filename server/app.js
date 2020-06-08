// This file exposes the whole app as a library.

var express = require('express'),
    app = express(),
    bodyParser = require('body-parser');


// Middleware for parsing json objects
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Production setup
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('reactApp/build'));

    const path = require('path');
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'reactApp', 'build', 'index.html'));
    });
}

// Handle BW API routes
require('./routes/sales')(app);

module.exports = app;
