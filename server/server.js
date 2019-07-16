var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.send('<p>express server running...</p>');
});

var socketList = [];

io.on('connection', function(socket){
    console.log('SERVER: a user connected: ' + socket.id);
    socketList.push(socket);

    socket.on('get.variables', function(data){
        console.log('SERVER: data sent to panel!')
        console.log(data);
        socket.broadcast.emit('get.variables', data);
    });
    
    socket.on('give.variables', function(data){
        console.log('SERVER: data sent to app!')
        console.log(JSON.parse(data));
        socket.broadcast.emit('give.variables', data);
    });
    
    socket.on('order', function(data){
        console.log('SERVER: sending order data to panel!')
        console.log(JSON.parse(data));
        socket.broadcast.emit('process.order', data);
    });
});

io.on('disconnect', (socket) =>{
    console.log('closing socket: ' + socket.id);
    socket.close();
});

http.listen(9574, function(){
    console.log('SERVER: listening on port 9574...');
})