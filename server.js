var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
    console.log('Connected new client');
    socket.on('message', function(data) {
        io.emit('new_message', data)
    });

    socket.on('disconnect', function () {
        console.log('Client disconnected');
    });
});

http.listen(PORT, function() {
    console.log("Express server is up on port " + PORT);
});