var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.send('<p>express server running...</p>');
});

var socketList = [];
var illy_socket = null;

io.on('connection', function(socket){
    console.log(`\nSERVER: a user connected: ${socket.id}`);
    socketList.push(socket);
    console.log(`current socket list size => ${socketList.length}`);
    
    if(illy_socket){

        setTimeout(function () {
            socket.emit('illustrator.connected')
        }, 2000);
    }

    socket.on('illustrator', function(){
        console.log('\nillustrator has identified itself!');
        console.log(`illy id: ${socket.id}`);
        console.log(`current socket list size => ${socketList.length}`);
        illy_socket = socket;
        console.log('telling everyone about it!')
        socket.broadcast.emit('illustrator.connected');
    });

    socket.on('get.variables', function(data){
        console.log('\nSERVER: data sent to panel!')
        console.log(data);
        socket.broadcast.emit('get.variables', data);
    });
    
    socket.on('give.variables', function(data){
        console.log('\nSERVER: data sent to app!')
        console.log(JSON.parse(data));
        socket.broadcast.emit('give.variables', data);
    });
    
    socket.on('give.orders', function(data){
        console.log('\nSERVER: sending all order data to panel!')
        console.log(JSON.parse(data));
        socket.broadcast.emit('process', data);
    });

    socket.on('order.completed', function(data){
        console.log('\nSERVER: sending completed to app');
        console.log(JSON.parse(data));
        socket.broadcast.emit('completed', data);
    });

    socket.on('illustrator.settings', function (data) {
        console.log('\nSERVER: sending app settings to panel');
        console.log(JSON.parse(data));
        socket.broadcast.emit('settings', data);
    });

    socket.on('disconnect', function(){

        console.log(`closing socket: ${socket.id}`);

        if(illy_socket !== null && socket.id == illy_socket.id){

            console.log('\nsocket being closed is illustrator\'s socket');
            illy_socket = null;
            socket.broadcast.emit('illustrator.disconnected');
        }

        let index = socketList.indexOf(socket);
        socketList.splice(index, 1);
        console.log(`\ncurrent socket list size => ${socketList.length}`);
    });
});

http.listen(9574, function(){
    console.log('SERVER: listening on port 9574...');
})