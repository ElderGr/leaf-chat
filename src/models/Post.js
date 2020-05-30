const { Schema, model } = require('mongoose');

const PostSchema = new Schema({
  content: {
    type: String
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  owner:{
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  files:[{
    type: String
  }]
},{
  timestamps: true
})

module.exports = model('Post', PostSchema);