const config = require('./config.js'),
      redis  = require('redis');

var client = redis.createClient(config);

var promiser = (resolve, reject) => {
  return (err, data) => {
    if(err) reject(err);
    resolve(data);
  }
}

var get = (key) => {
  return new Promise((resolve, reject) => {
    client.get(key, promiser(resolve, reject));
  })
};

var set = (key, value) => {
  return new Promise((resolve, reject) => {
    client.set(key, value, promiser(resolve, reject));
  })
};

var decr = (key) => {
  return new Promise((resolve, reject) => {
    client.decr(key, promiser(resolve, reject));
  })
};

var incr = (key) => {
  return new Promise((resolve, reject) => {
    client.incr(key, promiser(resolve, reject));
  })
};

var hget = (key, field) => {
  return new Promise((resolve, reject) => {
    client.hget(key, field, promiser(resolve, reject));
  })
};

var hset = (key, field, value) => {
  return new Promise((resolve, reject) => {
    client.hset(key, field, value, promiser(resolve, reject));
  })
};

var hgetall = (key) => {
  return new Promise((resolve, reject) => {
    client.hgetall(key, promiser(resolve, reject));
  })
};

var hdel = (key, field) => {
  return new Promise((resolve, reject) => {
    client.hdel(key, field, promiser(resolve, reject));
  })
};

var lpop = (key) => {
  return new Promise((resolve, reject) => {
    client.lpop(key, promiser(resolve, reject));
  })
};

var lpush = (key, value) => {
  return new Promise((resolve, reject) => {
    client.lpush(key, value, promiser(resolve, reject));
  })
};

var lrem = (key, value) => {
  return new Promise((resolve, reject) => {
    client.lrem(key, 1, value, promiser(resolve, reject));
  })
};

module.exports.get = get;
module.exports.set = set;
module.exports.decr = decr;
module.exports.incr = incr;
module.exports.hget = hget;
module.exports.hset = hset;
module.exports.hgetall = hgetall;
module.exports.hdel = hdel;
module.exports.lpop = lpop;
module.exports.lpush = lpush;
module.exports.lrem = lrem;
module.exports.client = client;
