const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

io.sockets.on('connection', function(socket) {
	socket.on('createNote', (data) => socket.broadcast.emit('onNoteCreated', data));

	socket.on('updateNote', (data) => socket.broadcast.emit('onNoteUpdated', data));

	socket.on('moveNote', (data) => socket.broadcast.emit('onNoteMoved', data));

	socket.on('deleteNote', (data) => socket.broadcast.emit('onNoteDeleted', data));
});

http.listen(port, () => console.log('listening on port ' + port));