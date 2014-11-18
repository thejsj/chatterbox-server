/*jshint node:true */

var express = require('express');
var app = express();
var handleRequest = require('./request-handler');

// Serve our API requests
app.get('/classes/*', handleRequest.requestHandler);
app.post('/classes/*', handleRequest.requestHandler);

// Serve Static Files
app.use(express.static(__dirname + '/../client'));
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/../client/index.html');
});

// Server a 404 for files not found
app.get('*', function (req, res) {
  console.log('Log 404');
  res.sendStatus(404);
});

app.listen(process.env.PORT || 1337);
