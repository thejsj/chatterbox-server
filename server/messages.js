/*jshint node:true */
var fs = require('fs');
var _ = require('underscore');

var Messages = function (filename) {
  this._counter = 0;
  this._filename = filename;
  this._messages = {};
  try {
    fs.readFile(this._filename, 'utf-8', function (err, data) {
      if (err) throw err;
      try {
        var jsonData = JSON.parse(data);
        this._counter += jsonData.counter;
        if (jsonData.messages !== null) {
          _.each(jsonData.messages, function (roomMessages, roomName) {
            this._messages[roomName] = this._messages[roomName] || [];
            _.each(roomMessages, function (message) {
              this._messages[roomName].push(message);
            }.bind(this));
          }.bind(this));
        }

      } catch(err) {}
      if (this.getAllMessages().length === 0) {
        this.addMessageToRoom('test', {username: 'test', text: 'text'});
      }
    }.bind(this));
  } catch(err) {}
};

Messages.prototype.getAllMessages = function(){
  return _.reduce(this._messages, function(memo, roomMessages){
    return memo.concat(roomMessages);
  }, []);
};

Messages.prototype.getMessages = function (roomName) {
  if (roomName !== undefined && roomName !== '' ) {
    return this.getMessagesFromRoom(roomName);
  }
  return this.getAllMessages();
};

Messages.prototype.getMessagesFromRoom = function (roomName){
  if (!(roomName in this._messages)) {
    return [];
  }
  return this._messages[roomName];
};

Messages.prototype.addMessageToRoom = function (roomName, singleMessage) {
  this._messages[roomName] = this._messages[roomName] || [];
  // Add ID and Date
  this._messages[roomName].push({
    objectId: this._counter++,
    createdAt: new Date().getTime(),
    username: singleMessage.username,
    text: singleMessage.text,
    roomname: singleMessage.roomname
  });
  fs.writeFile(this._filename, this.getJSON(), function (err) {
    if (err) throw err;
  }.bind(this));
  return this._messages;
};

Messages.prototype.getJSON = function(){
  return JSON.stringify({counter: this._counter, messages: this._messages});
};

module.exports = Messages;
