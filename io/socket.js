const db = require('../db'),
      EVENTS = {
        ON: {
          PLAYER: 'playerEvent',
          STARTING: 'starting'
        },
        EMIT: {
          GAME: 'gameEvent',
          TYPE: {
            START: 'START',
            PLAYERS_ONLINE: 'PLAYERS_ONLINE',
            WAIT: 'WAIT',
          }
        },
        DISCONNECT: 'disconnect'
      }

var logErr = (err) => {
  console.log(err)
}

module.exports = (io) => {

  var joinExistingRoom = (room, socket) => {
      
    console.log('joinExistingRoom');

    socket.join(room, () => {

      socket.on(EVENTS.ON.PLAYER, data => socket.to(room).emit(EVENTS.ON.PLAYER, data))

      io.in(room).clients(function (err, clients) {

        if(Math.ceil(Math.round(Math.random()))){
          io.to(clients[0]).emit(EVENTS.EMIT.GAME, {
            type: EVENTS.EMIT.TYPE.START,
            turn: true 
          });
          io.to(clients[1]).emit(EVENTS.EMIT.GAME, {
            type: EVENTS.EMIT.TYPE.START,
            turn: false 
          });
        }else{
          io.to(clients[0]).emit(EVENTS.EMIT.GAME, {
            type: EVENTS.EMIT.TYPE.START,
            turn: false 
          });
          io.to(clients[1]).emit(EVENTS.EMIT.GAME, {
            type: EVENTS.EMIT.TYPE.START,
            turn: true 
          });
        }
      });

      socket.removeListener(EVENTS.DISCONNECT, updatePlayersOnline)
      socket.on(EVENTS.DISCONNECT, onDisconnect(room))

    })
  }

  var createsAndEnterRoom = (socket) => {

    console.log('createsAndEnterRoom');

    db.redis.incr(db.keys.ROOM_COUNTER).then(val => {

      let room = `room${(val - 1)}`
    
      socket.join(room, () => {
        
        io.to(room).emit(EVENTS.EMIT.GAME, { 
          type: EVENTS.EMIT.TYPE.WAIT
        });

        db.redis.lpush(db.keys.WAITING_ROOM, room)
          // .then( data => {

          // }).catch( err => console.log(err))
          
        socket.on(EVENTS.ON.PLAYER, data =>  socket.to(room).emit(EVENTS.ON.PLAYER, data))
        socket.removeListener(EVENTS.DISCONNECT, updatePlayersOnline)
        socket.on(EVENTS.DISCONNECT, onDisconnect(room))

      })
    })
  }

  var onDisconnect = room => {

    return () => {

      updatePlayersOnline()

      io.of('/').adapter.clients([room], (err, clients) => {

        if(clients.length){

          db.redis.lpush(db.keys.WAITING_ROOM,room);

          io.to(room).emit(EVENTS.EMIT.GAME, { 
            type: EVENTS.EMIT.TYPE.WAIT
          });

        }else{
          db.redis.lrem(db.keys.WAITING_ROOM, room);
        }

      });

    }; 
  };


  var updatePlayersOnline = () => {
    io.emit(EVENTS.EMIT.GAME, { 
      type: EVENTS.EMIT.TYPE.PLAYERS_ONLINE,
      value: io.engine.clientsCount
    })
  }

  return (socket) => {

    socket.on(EVENTS.DISCONNECT, updatePlayersOnline)
    
    updatePlayersOnline()
        
    console.log('Socket connect!');
    
    socket.on(EVENTS.ON.STARTING, data => {

      socket.nickname = data.name

      
      db.redis.lpop(db.keys.WAITING_ROOM)
        .then( room => {
          room ? joinExistingRoom(room, socket) : createsAndEnterRoom(socket)
        }).catch(logErr)

    })
  }
}
