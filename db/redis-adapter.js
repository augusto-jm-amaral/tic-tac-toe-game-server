const config = require('./config.js')
      redis = require('socket.io-redis'); 

var client = redis(config);

module.exports = client;