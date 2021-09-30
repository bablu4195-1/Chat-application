const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')

 
const app = express()
const server = http.createServer(app)
const port = process.env.PORT || 3000
const publicDirectory = path.join(__dirname,'../public')
const io = socketio(server)
const { generateMessage,
    generateLocationMessage } = require('./utils/messages')
const {  addUser,
    removeUser,
    getUser,
    getUsersInRoom} = require('./utils/users')


app.use(express.static(publicDirectory))


io.on('connection',(socket)=>{
//     console.log('New web socket Connection')
//     socket.emit('countUpdated',count)
//     socket.on('increment',()=>{
//      count++
//     //  socket.emit('countUpdated',count)
//     io.emit('countUpdated',count)
//     })
console.log('New web socket connection')

socket.on('join',(options,callback)=>{
    const {error,user}= addUser({id:socket.id, ...options})
    if(error){
      return callback(error)
    }
    socket.join(user.room)
    socket.emit('message',generateMessage('Welcome!'))
socket.broadcast.to(user.room).emit('message',generateMessage(`${user.username} has joined!`))
callback()
})
socket.on('submitMessages',(message,callback)=>{
    const filter = new Filter()
    if(filter.isProfane(message)){
        return callback('profanity is not allowed')
    }
io.to('101').emit('message', generateMessage(message))
callback('Delivered!')
})
socket.on('disconnect',()=>{
    const user = removeUser(socket.id)
    if(user){
        io.to(user.room).emit('message',generateMessage(`${user.username} has left`))
    }
})
socket.on('sendLocation',(position,callback)=>{
    io.emit('locationMessage', generateLocationMessage(`https://google.com/maps?q=${position.latitude},${position.longitude}`))
    callback()
})
})

server.listen(port,()=>{
    console.log(`Example server is running on port ${port} `)
})