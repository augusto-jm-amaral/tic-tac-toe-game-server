const db = require('../db'),
      socketio = require('socket.io'),
      socketManager = require('./socket.js');

module.exports = function (server){

  var io = socketio(server);

  db.init();

  io.adapter(db.adapter);

  io.on('connection', socketManager(io));

};
