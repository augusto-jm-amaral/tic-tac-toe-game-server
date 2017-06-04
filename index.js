const express  = require('express');
      io       = require('./io');

var app = express();

var server = app.listen(3000, () => {
  console.log('App online!');
});

io(server);