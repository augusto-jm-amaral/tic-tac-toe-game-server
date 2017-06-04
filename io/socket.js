const db = require('../db');

const WAITING_ROOM = 'WAITING_ROOM', 
      ROOM_COUNTER = 'ROOM_COUNTER'; 

var logErr = (err) => {
  console.log(err);
};

module.exports = (io) => {

  var joinExistingRoom = (room, socket) => {
      
    socket.join(room, () => {

      io.to(room).emit('game.event',{
        type: 'START_GAME'
      });

      socket.on('player.event', (data) => {
        socket.to(room).emit('player.event', data);
      });
      
      socket.on('disconnect', onDisconnect(room));
    });
  };

  var onDisconnect = (room) => {

    return () => {
      io.of('/').adapter.clients([room], (err, clients) => {
        if(clients.length){
          db.redis.lpush(WAITING_ROOM,room);
          io.to(room).emit('game.event', { 
            type: 'WAIT_GAME'
          });

        }else{
          db.redis.lrem(WAITING_ROOM, room);
        } 
      });
    }; 
  };

  var createsAndEnterRoom = (socket) => {

    db.redis.get('ROOM_COUNTER')
      .then( numberOfNewRoom => {
        
        db.redis.incr('ROOM_COUNTER');

        var room = 'room' + numberOfNewRoom;
        
        db.redis.lpush(WAITING_ROOM, room)
          .then((data) => {

            socket.join(room, () => {
              
              io.to(room).emit('game.event', { 
                type: 'WAIT_GAME'
              });

              socket.on('player.event', (data) => {
                socket.to(room).emit('player.event', data);
              });

              socket.on('disconnect', onDisconnect(room));
            });
          })
          .catch( err => console.log(err));
      });
  };

  return (socket) => {

    db.redis.lpop(WAITING_ROOM)
      .then( room => {
        room ? joinExistingRoom(room, socket) : createsAndEnterRoom(socket);
      }).catch(logErr);
  };
};
