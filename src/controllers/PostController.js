//models
const Post = require('../models/Post')
const User = require('../models/User')

const database = require('../services/firebase');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

module.exports = {

  async index(req, res) {
    try {
      const items = await database.ref('Post').once('value');
      let posts = [];

      items.forEach(item => {
        if(item.val().comments !== undefined && item.val().comments !== null){
          let comments = Object.keys(item.val().comments);
          comments = comments.map(comment => { return { id: comment, ...item.val().comments[comment]} })
  
          posts.push({
            ...item.val(),
            comments,
            id: item.ref_.path.pieces_[1]
          });
        }else{
          posts.push({
            ...item.val(),
            id: item.ref_.path.pieces_[1]
          });
        }
      })
      return res.json(posts);
    } catch (e) {
      return res.status(400).json({ error: e });
    }

  },

  async store(req, res) {

    try{
      let src;
  
      if (req.file !== undefined) {
        const { filename: image } = req.file;
        src = image;
      }
  
      const { owner, content } = req.body;
  
      const userExists = await User.findOne({ _id: owner });
      console.log(userExists)

      if(!userExists) throw "User not found!";
  
      const newPost = await Post.create({
        owner,
        content,
        comments: [],
        files: [req.file !== undefined ? `http://localhost:5000/files/${src}` : '']
      })
  
      return res.json(newPost);
    }catch(err){
      return res.status(400).json({ err })
    }
  },

  
  async destroy(req, res){
    const {id} = req.params;

    await database.ref(`Post/${id}`).remove();

    return res.json({status: 'deletado com sucesso'});
  }
}
