const Server = use('Server')
const io = use('socket.io')(Server.getInstance())

io.on('connection', function (socket) {
  console.log('socket id', socket.id)

  socket.on('driver_location', (data) => {
    console.log('data', data)
    console.log('driver location lat', data.lat, 'lng', data.lng)
  })


})



io.on('message', (data) => {
  console.log('data', data)
})
