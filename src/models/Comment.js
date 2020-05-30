const {Schema, model} = require('mongoose');

const CommentSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
},{
    timestamps: true
})

module.exports = model('Comment', CommentSchema)