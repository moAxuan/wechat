var users = {};
module.exports = (io) => {
  io.on('connection', (socket) => {
// 用户注册
    socket.on('login', (id) => {
      // socket.emit('msg', id)
      socket.name = id
      users[id] = socket.id
      // console.log(users)
    })
    
    socket.on('msg', (msg, fromid, toid) => {
      io.emit('getmsg', msg, fromid, toid)
    })
// 用户离开
    socket.on('disconnect', _ => {
      if(users.hasOwnProperty(socket.name)) {
        delete users[socket.name]
      }
      console.log(socket.id + '离开')
    })

  })
}