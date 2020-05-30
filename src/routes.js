const express = require('express');
const multer = require('multer')
const uploadConfig = require('./config/upload');
const routes = express.Router();

const upload = multer(uploadConfig);

const SessionController = require('./controllers/SessionController');
const UserController = require('./controllers/UserController');

const ChatController = require('./controllers/ChatController');
const MessageController = require('./controllers/MessageController');
const PostController = require('./controllers/PostController');
const LikeController = require('./controllers/LikeController');
const CommentsController = require('./controllers/CommentsController');
const fs = require('fs');
const database = require('./services/firebase')

//login
routes.get('/sessions', SessionController.index);
routes.post('/sessions', SessionController.store);

//Post
routes.get('/posts', PostController.index);
routes.post('/posts', upload.single('file'), PostController.store);
routes.delete('/posts/:id', PostController.destroy);
//Likes
routes.post('/posts/:postId/like', LikeController.store);
//Coments
routes.post('/posts/:postId/comment', CommentsController.store);

//User
routes.get('/users', UserController.index);
routes.get('/users/:uid', UserController.show);
routes.post('/users', upload.single('profileImage'), UserController.store);
routes.put('/users/:uid/', UserController.update);
routes.delete('/users/:uid', UserController.destroy);

//chats
routes.get('/teste', ChatController.teste);

routes.get('/chat', ChatController.index);
routes.post('/chat', upload.single('image'), ChatController.store);
//audio
routes.post('/chat/audio', multer().single('audio'), async (req, res) => {
    
    let src;
        
        if (req.file !== undefined) {
            const { filename: audio } = req.file;
            src = audio;
        }

        const { content, owner, receiver, type } = JSON.parse(req.body.content);
        const fileName = `${owner.id}___${new Date().getTime()}.wav`;

        let uploadLocation = `./uploads/blob/${fileName}` 
        fs.writeFileSync(uploadLocation, Buffer.from(new Uint8Array(req.file.buffer))); 
        
        const messageStruct = {
            image: req.file !== undefined ? `http://localhost:5000/files/${src}` : '',
            owner,
            receiver,
            content: `http://localhost:5000/files/blob/${fileName}`,
            type,
            timestamp: new Date().getTime()
        }

        const chatStruct = {
            participants: [owner.id, receiver.id],
            messages: [messageStruct]
        }

        // console.log(messageStruct)
        const chats = await database.ref('/Chats').once('value');

        let targetChat = '';

        chats.forEach(item => {
            if (item.val().participants.indexOf(owner.id) !== -1 && item.val().participants.indexOf(receiver.id) !== -1) targetChat = item.val();
        })

        //identifica se o chat existe ou não
        let createdChat;
        

        if (targetChat === '') {
            await database.ref('/Chats').push(chatStruct).then(message => {
                createdChat = message.path.pieces_[1];
            })

            chatStruct.id = createdChat;

            //conexoes do socket
            const ownerSocket = req.connectedUsers[owner.id];
            const receiverSocket = req.connectedUsers[receiver.id];
            if (ownerSocket) {
                req.io.to(ownerSocket).emit('new chat', chatStruct);
            }

            if (receiverSocket) {
                req.io.to(receiverSocket).emit('new chat', chatStruct);
            }
        }

        return res.json({message: 'Chat created'})
});



routes.delete('/chat/:chatid', ChatController.destroy);

//message
routes.post(`/message/:chatid`, upload.single('image'), MessageController.store);
routes.post(`/message/:chatid/audio`, multer().single('audio'), async (req, res) =>{
    let src; 
        if (req.file !== undefined) {
            const { filename: audio } = req.file;
            src = audio;
        }

        const {chatid} = req.params;
        const {content, owner, receiver, type} = JSON.parse(req.body.content);
        const fileName = `${owner.id}___${new Date().getTime()}.wav`;

        let uploadLocation = `./uploads/blob/${fileName}` 
        fs.writeFileSync(uploadLocation, Buffer.from(new Uint8Array(req.file.buffer))); 

        const messageStruct = {
            image: req.file !== undefined ? `http://localhost:5000/files/${src}` : '', 
            owner,
            receiver,
            content: `http://localhost:5000/files/blob/${fileName}`,
            type,
            timestamp: new Date().getTime()
        }

        //conexoes do socket
        const ownerSocket = req.connectedUsers[owner.id];
        const receiverSocket = req.connectedUsers[receiver.id];

        if(ownerSocket){
            req.io.to(ownerSocket).emit('chat message', messageStruct);
        }

        if(receiverSocket){
            req.io.to(receiverSocket).emit('chat message', messageStruct);
        }

        await database.ref(`Chats/${chatid}/messages`).push(messageStruct);

        return res.json({message: 'success'})
});


module.exports = routes;