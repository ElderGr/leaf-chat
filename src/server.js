require('dotenv').config();

const express = require('express');
const routes = require('./routes.js');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const path = require('path');

const connectedUsers = {};

//conexão com o mongoDB
mongoose.connect('mongodb+srv://gabriel_mongo:gabriel14@cluster0-jkub1.mongodb.net/leaf_chat?retryWrites=true&w=majority',{
    useNewUrlParser: true,
    useUnifiedTopology: true
})

//configuração do cors
app.use(cors());

//processo ao cliente conetar no socket
io.on('connection', socket =>{

    const { user } = socket.handshake.query;
    
    connectedUsers[user] = socket.id;
});

//middleware referente ao chat
app.use((req, res, next)=>{
    req.io = io;
    req.connectedUsers = connectedUsers;

    return next();
});


app.use(express.json());
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')));
app.use(routes);

server.listen( process.env.PORT || 5000);


