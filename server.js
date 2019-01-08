const path = require('path')

const express = require('express')
const socketio = require('socket.io')
const http = require('http')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

app.use('/',express.static(path.join(__dirname,'frontend')))

let usernames = [];

io.on('connection',(socket)=>{
    console.log('Socket Connected from id : ' + socket.id)

    socket.on('new user',function(data,callback){
        if(usernames.indexOf(data) !== -1){
            callback(false)
        }else{
            callback(true)
            socket.username = data
            usernames.push(socket.username)
            updateUsernames();
        }
    })

    function updateUsernames(){
        io.emit('usernames',usernames)
    }

    socket.on('send message',(data)=>{
        io.emit('new message',{msg:data,user:socket.username})
    })

    socket.on('disconnect',function(data){
        if(!socket.username){
            return;
        }
        
        usernames.splice(usernames.indexOf(socket.username),1);
        updateUsernames();
    })

   
})

server.listen(process.env.PORT || 3454);
console.log('Server Running...')
