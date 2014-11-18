/*jshint node:true */

var Messages = require('./messages');

var messages = new Messages('./_messages.json');

var returnResponse = function(response, statusCode, roomName){
  var headers = {
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'access-control-allow-headers': 'content-type, accept',
    'access-control-max-age': 10, // Seconds.
    'Content-Type': 'application/json'
  };
  if (statusCode >= 200 && statusCode < 300) {
    response.writeHead(statusCode, headers);
    response.end(JSON.stringify({
      results: messages.getMessages(roomName)
    }));
    return true;
  }
  if (statusCode === 404) {
    response.writeHead(statusCode, headers);
    response.end(JSON.stringify({}));
    return true;
  }
  return returnResponse(response, 404);
};

var requestHandlerPOST = function (request, response, roomName) {
  var body = '';
  request.on('data', function (data) {
    body += data;
    if (body.length > 1e6) {
      request.connection.destroy();
    }
  });
  request.on('end', function () {
    messages.addMessageToRoom(roomName, JSON.parse(body));
    returnResponse(response, 201);
  });
  return true;
};

var requestHandler = function(request, response) {
  var requestUrl = request.url.split('/');
  if (requestUrl[1] === 'classes') {
    if (request.method === 'POST') {
      return requestHandlerPOST(request, response, requestUrl[2]);
    }
    if (request.method === 'GET' || request.method === 'OPTIONS') {
      return returnResponse(response, 200, requestUrl[2]);
    }
  }
  return returnResponse(response, 404);
};

exports.requestHandler = requestHandler;
