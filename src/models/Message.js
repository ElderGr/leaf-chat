const {Schema, model} = require('mongoose');

const MessageSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    content: {
        type: String
    },
    files: [{
        type: String
    }],
    chat: {
        type: Schema.Types.ObjectId,
        ref: 'Chat'
    }
},{
    timestamps: true
})

module.exports = model('Message', MessageSchema);