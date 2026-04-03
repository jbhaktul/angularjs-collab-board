const express = require('express');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

// Configuration
const MONGO_URI = process.env.MONGO_URI;
const DB_PATH = path.join(__dirname, 'notes.json');

app.use(express.static(__dirname + '/public'));

// --- MONGODB SETUP ---
let Note;
let isMongo = false;

if (MONGO_URI) {
    mongoose.connect(MONGO_URI)
        .then(() => {
            console.log('Connected to MongoDB');
            isMongo = true;
        })
        .catch(err => console.error('MongoDB connection error:', err));

    const noteSchema = new mongoose.Schema({
        id: { type: String, required: true, unique: true },
        title: String,
        body: String,
        x: Number,
        y: Number
    });
    Note = mongoose.model('Note', noteSchema);
}

// --- JSON FILE FALLBACK ---
let localNotes = [];
if (!MONGO_URI && fs.existsSync(DB_PATH)) {
    try {
        localNotes = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    } catch (e) {
        console.error('Error loading notes.json:', e);
    }
}

const saveLocalNotes = () => {
    if (!isMongo) {
        fs.writeFileSync(DB_PATH, JSON.stringify(localNotes, null, 2));
    }
};

// --- API & SOCKETS ---
const getAllNotes = async () => {
    if (isMongo) {
        return await Note.find({});
    }
    return localNotes;
};

io.on('connection', async (socket) => {
    console.log('A user connected');

    // Send initial data
    const notes = await getAllNotes();
    socket.emit('allNotes', notes);

    socket.on('createNote', async (data) => {
        if (isMongo) {
            await Note.create(data);
        } else {
            localNotes.push(data);
            saveLocalNotes();
        }
        socket.broadcast.emit('onNoteCreated', data);
    });

    socket.on('updateNote', async (data) => {
        if (isMongo) {
            await Note.findOneAndUpdate({ id: data.id }, data);
        } else {
            const index = localNotes.findIndex(n => n.id === data.id);
            if (index !== -1) {
                localNotes[index] = data;
                saveLocalNotes();
            }
        }
        socket.broadcast.emit('onNoteUpdated', data);
    });

    socket.on('moveNote', async (data) => {
        if (isMongo) {
            await Note.findOneAndUpdate({ id: data.id }, { x: data.x, y: data.y });
        } else {
            const index = localNotes.findIndex(n => n.id === data.id);
            if (index !== -1) {
                localNotes[index].x = data.x;
                localNotes[index].y = data.y;
                saveLocalNotes();
            }
        }
        socket.broadcast.emit('onNoteMoved', data);
    });

    socket.on('deleteNote', async (data) => {
        if (isMongo) {
            await Note.deleteOne({ id: data.id });
        } else {
            localNotes = localNotes.filter(n => n.id !== data.id);
            saveLocalNotes();
        }
        socket.broadcast.emit('onNoteDeleted', data);
    });
});

http.listen(port, () => console.log('listening on port ' + port));