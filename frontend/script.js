let socket = io();

socket.on('connected',() => {
    console.log("Connected" + socket.id)
})

$(function(){
    let messageForm = $('#messageForm')
    let message = $('#message');
    let chat = $('#chatWindow');
    let usernameForm = $('#usernameForm');
    let users = $('#users');
    let username  = $('#username')
    let error = $('#error')

    usernameForm.submit(function(e){
        e.preventDefault();
        socket.emit('new user',username.val(),function(data){
            if(data){
                $('#namesWrapper').hide();
                $('#mainWrapper').show();
            }else{
                error.html('Username is taken')
            }
        })
    })

    socket.on('usernames',function(data){
        var html = '';
        for(i=0;i < data.length; i++){
            html += data[i] + '<br>'
        }
        users.html(html)
    })

    messageForm.submit(function(e){
        e.preventDefault();
        socket.emit('send message',message.val());
        message.val('')
    })
    

    socket.on('new message',function(data){
        chat.append('<strong>' + data.user + '</strong>' +  data.msg + '<br>')
    })
})
