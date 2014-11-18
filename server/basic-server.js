/*jshint node:true */

/* Import node's http module: */
var express = require('express');
var app = express();
var handleRequest = require('./request-handler');

app.get('/classes/*', handleRequest.requestHandler);
app.post('/classes/*', handleRequest.requestHandler);

app.use(express.static(__dirname + '/../client'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/../client/index.html');
});

app.get('*', function (req, res) {
  console.log('Log 404');
  res.sendStatus(404);
});


app.listen(3000);
