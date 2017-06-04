const db = require('../db'),
      socketio = require('socket.io'),
      socketManager = require('./socket.js');

module.exports = function (server){

  var io = socketio(server);

  db.init();

  io.adapter(db.adapter);

  io.on('connection', socketManager(io));

};

// io.on('connection', socket => {

//   db.redis.lpop('rooms_wait')
//     .then( room => {
//       if(room){

//         socket.join(room, () => {
//           io.to(room).emit('game.event',{
//             type: 'START_GAME'
//           });

//           socket.on('player.event', (data) => {
//             socket.to(room).emit('player.event', data);
//           });
          
//           socket.on('disconnect', (e) => {
//             io.of('/').adapter.clients([room], (err, clients) => {
//               if(clients.length){
//                 db.redis.lpush('rooms_wait',room);
//                 io.to(room).emit('game.event', { 
//                   type: 'WAIT_GAME'
//                 });

//               }else{
//                 db.redis.lrem('rooms_wait', room);
//               } 
//             });
//           });
//         });

//       }else{


//         db.redis.get('room_number')
//           .then( numberOfNewRoom => {
            
//             db.redis.incr('room_number');

//             var room = 'room' + numberOfNewRoom;
            
//             db.redis.lpush('rooms_wait', room)
//               .then((data) => {

//                 socket.join(room, () => {
//                   io.to(room).emit('game.event', { 
//                     type: 'WAIT_GAME'
//                   });

//                   socket.on('player.event', (data) => {
//                     socket.to(room).emit('player.event', data);
//                   });

//                   socket.on('disconnect', (e) => {
//                     io.of('/').adapter.clients([room], (err, clients) => {
//                       if(clients.length){
//                         db.redis.lpush('rooms_wait',room);
                        
//                         io.to(room).emit('game.event', { 
//                           type: 'WAIT_GAME'
//                         });

//                       }else{
//                         db.redis.lrem('rooms_wait', room);
//                       } 
//                     });
//                   });
//                 });
//               })
//               .catch( err => console.log(err));
//           })
//           .catch( err => console.log(err));
//       }
//     })
//     .catch(err => console.log(err));

// });
