var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server);
	var path = require('path');
	
	app.set('port', process.env.PORT || 3000);
	app.use(express.static(path.join(__dirname, 'public')));

io.sockets.on('connection', function(socket) {
	socket.on('createNote', function(data) {
		socket.broadcast.emit('onNoteCreated', data);
	});

	socket.on('updateNote', function(data) {
		socket.broadcast.emit('onNoteUpdated', data);
	});

	socket.on('moveNote', function(data){
		socket.broadcast.emit('onNoteMoved', data);
	});

	socket.on('deleteNote', function(data){
		socket.broadcast.emit('onNoteDeleted', data);
	});
});

server.listen(app.get('port'), function () {
	console.log('Express server listening on port ' + app.get('port'))
});