var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.send('<h1>express server running...</h1>');
});

io.on('connection', function(socket){
    console.log('SERVER: a user connected');
    
    socket.on('data', function(data){
        console.log('SERVER: data recieved from app!')
        console.log(JSON.parse(data));
    });
});

http.listen(9574, function(){
    console.log('SERVER: listening on port 9574...');
})