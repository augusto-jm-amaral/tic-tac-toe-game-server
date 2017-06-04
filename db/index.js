const redis   = require('./redis.js'),
      adapter = require('./redis-adapter.js');

var init = () => {
  // redis.client.flushall();
  redis.set('room_number', 0);
  // redis.client.del('rooms');
  redis.client.del('rooms_wait');
};

module.exports.adapter = adapter;
module.exports.redis = redis;
module.exports.init = init;