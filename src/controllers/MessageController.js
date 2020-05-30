const database = require('../services/firebase')

module.exports = {
    async store(req, res){
        
        let src; 
        if(req.file !== undefined) {
            const { filename: image } = req.file;
            src = image;
        }

        const {chatid} = req.params;
        const {content, owner, receiver, type} = JSON.parse(req.body.content);

        const messageStruct = {
            image: req.file !== undefined ? `http://localhost:5000/files/${src}` : '', 
            owner,
            receiver,
            content, 
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
    }
}