
const database = require('../services/firebase');

module.exports = {
    async index(req, res) {
        const items = await database.ref('/Chats').once('value');
        const { user } = req.headers;

        let chats = [];

        items.forEach(item => {

            if (item.val().participants.indexOf(user) !== -1) {

                chats.push({
                    ...item.val(),
                    messages: Object.values(item.val().messages),
                    id: item.ref_.path.pieces_[1]
                });
            }

        })

        return res.json(chats)
    },
    async store(req, res) {
        let src;
        
        if (req.file !== undefined) {
            const { filename: image } = req.file;
            src = image;
        }

        const { content, owner, receiver, type } = JSON.parse(req.body.content);

        const messageStruct = {
            image: req.file !== undefined ? `http://localhost:5000/files/${src}` : '',
            owner,
            receiver,
            content,
            type,
            timestamp: new Date().getTime()
        }

        const chatStruct = {
            participants: [owner.id, receiver.id],
            messages: [messageStruct]
        }

        const chats = await database.ref('/Chats').once('value');

        let targetChat = '';

        chats.forEach(item => {
            if (item.val().participants.indexOf(owner.id) !== -1 && item.val().participants.indexOf(receiver.id) !== -1) targetChat = item.val();
        })

        //identifica se o chat existe ou não
        let createdChat;
        // console.log(targetChat)

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

    },

    async destroy(req, res){
        const {chatid} = req.params;

        await database.ref(`Chats/${chatid}`).remove();

        return res.json({res: 'teste'})
    },

    async teste(req, res){
        const items = await database.ref('/Teste').once('value');
        return res.json(items)
    }
}