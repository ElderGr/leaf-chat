const database = require('../services/firebase');
const User = require('../models/User'); 


module.exports = {

  async index(req, res) {
    try {
      const users = await database.ref('User').once('value');
    
      return res.json({ users: users })

    } catch(e) {

        return res.status(400).json({ error: e });
    }
  },

  async store(req, res) {
      let newSession = req.body;

      try{
        await database.ref('User').push(newSession)

        return res.json({ok: 'ok'})

      }catch(err){
        return res.json({err})
      }
  }
}
