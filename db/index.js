const redis   = require('./redis.js'),
      adapter = require('./redis-adapter.js');

const WAITING_ROOM = 'WAITING_ROOM', 
      ROOM_COUNTER = 'ROOM_COUNTER',
      PLAYERS_COUNTER = 'PLAYERS_COUNTER'; 

var init = () => {
  redis.set(PLAYERS_COUNTER, 0);
  redis.client.del(WAITING_ROOM);
};

module.exports.adapter = adapter;
module.exports.redis = redis;
module.exports.init = init;
module.exports.keys = {
  WAITING_ROOM,
  ROOM_COUNTER
}