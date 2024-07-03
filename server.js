import express from 'express';
import { Server } from 'socket.io';
import userRouter from './user.routes.js';
import { messageModel } from './message.schema.js';
import http from 'http';
import { connect } from './config.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('upload'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/users', userRouter);

// Handle HTML page routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signin.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/chat', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'chat.html'));
});

// Creating server using http
const server = http.createServer(app);

// Create socket server
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    }
});

// Use socket events
let connectedUsers = [];

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('userConnected', async (user) => {
        try {
            const messages = await messageModel.find().sort({ createdAt: 1 })
            socket.emit('previousMessages', messages);
            // console.log(previousMessages);

            user.id = socket.id;
            socket.username = user.name;
            connectedUsers.push(user);
            io.emit('updateUserList', connectedUsers);

            socket.emit('welcome', {
                message: `Welcome, ${user.name}!`,
            });
            io.emit('userNumber', { connectedUser: connectedUsers.length });
        } catch (error) {
            console.error('Error fetching previous messages:', error);
        }
    });
socket.on('typing',(user)=>{
    socket.broadcast.emit('typing', user);
});
    socket.on('chatMessage', async (userMessage) => {
        try {
            console.log(userMessage);
            const message = new messageModel({
                userId: userMessage.userid,
                username: userMessage.username,
                text: userMessage.message,
                imageUrl:userMessage.image
            });
            await message.save();

            // Broadcast this message to all the clients.
            socket.broadcast.emit('broadcast_message', {
                ...userMessage,
                createdAt: message.createdAt
            });
        } catch (error) {
            console.error('Error saving message:', error);
        }
    });

    socket.on('disconnect', () => {
        const index = connectedUsers.findIndex(user => user.id === socket.id);
        if (index !== -1) {
            const user = connectedUsers.splice(index, 1)[0];
            console.log('user disconnected', user.name);
            io.emit('updateUserList', connectedUsers);
            io.emit('disconnects', {
                message: `Disconnected, ${user.name}!`,
            });
            io.emit('userNumber', { connectedUser: connectedUsers.length });
        }
    });
});

server.listen(3000, () => {
    console.log("App is listening on 3000");
    connect();
});
