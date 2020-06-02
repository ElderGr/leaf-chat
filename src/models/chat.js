const { Schema, model } = require('mongoose');

const ChatSchema = new Schema({
    participants:[{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    messages: [{
        type: Schema.Types.ObjectId,
        ref: 'Message'
    }]
})

module.exports = model('Chat', ChatSchema);