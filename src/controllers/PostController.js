const database = require('../services/firebase');
const Post = require('../models/Post')
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

    let src;

    if (req.file !== undefined) {
      const { filename: image } = req.file;
      src = image;
    }

    var newPost;
    const { owner, content } = JSON.parse(req.body.content);

    // await sharp(req.file.path)
    //   .resize(500)
    //   .jpeg({ quality: 70 })
    //   .toFile(
    //     path.resolve(req.file.destination, 'resized', src)
    //   )

    try {
      var newPost = await database.ref('Post').push({
        owner,
        content,
        likes: {},
        coments: {},
        image: req.file !== undefined ? `http://localhost:5000/files/${src}` : '',
        timestamp: new Date().getTime()
      }, function (err) {
        if (err) {
          res.send(err);
        } else {
          res.json({ newPost });
        }
      })
    } catch (err) {
      return res.json({ err })
    }
  },
  async destroy(req, res){
    const {id} = req.params;

    await database.ref(`Post/${id}`).remove();

    return res.json({status: 'deletado com sucesso'});
  }
}
