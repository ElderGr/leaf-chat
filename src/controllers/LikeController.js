const database = require('../services/firebase');
const Post = require('../models/Post')

module.exports = {

  async index(req, res) {
    try {

    /* var starCountRef = firebase.database().ref('posts/' + postId + '/starCount');
       starCountRef.on('value', function(snapshot) {
       updateStarCount(postElement, snapshot.val());
     }); */
      const items = await database.ref('Post').once('value');
     
      let posts = [];

      items.forEach(item =>{
          posts.push({
              ...item.val(),
              id: item.ref_.path.pieces_[1]
          });
      })
      return res.json(posts);
  } catch(e) {
      return res.status(400).json({ error: e });
  }

  },

  async store(req, res) {
    const { postId } = req.params;
    const { user } = req.headers;

    let targetPost = await database.ref('Post/' + postId+'/likes').once('value');
    let likes = [];

    
    targetPost.forEach(async item =>{
      likes.push(item.val());
    })

    if(likes.length === 0){
      likes = [user];
    }else{
      if(likes.indexOf(user) === -1){
        likes = likes.push(user);

      }else{
        likes = likes.filter(item => {return item !== user})

      }
    }
    
    await database.ref(`Post/${postId}/likes`).set(likes);

    return res.json(likes)
  }
};
