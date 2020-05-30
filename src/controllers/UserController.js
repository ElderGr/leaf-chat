const User = require('../models/User'); 

const jwt = require('jsonwebtoken')
const { isEmpty } = require('../functions/validate');

//old
const database = require('../services/firebase');

module.exports = {

    async index(req, res){
        try{
            const items = await database.ref('User').once('value');
            let users = [];

            items.forEach(item =>{
                const {password, ...obj} = item.val()

                users.push({
                    ...obj,
                    id: item.ref_.path.pieces_[1]
                });
            })
            return res.json(users);
        }catch(e){
            return res.status(400).json({ error: e });
        }
    },

    async show(req, res){
        const { uid } = req.params;
        
        try{
            await database.ref(`/User/${uid}`).once('value', function(snapshot) {
    
                if (snapshot.val() == null) {
    
                    res.json({ message: "Error: No user found", "result": false});
                   
                } else {
                    const {password, ...obj} = snapshot.val();

                    res.json({
                        ...obj,
                        id: snapshot.ref_.path.pieces_[1]
                    });
                }
            });
        }catch(err){
            return res.json({err});
        }
    },

    async store(req, res){
        let file; 
        const { name, email, password, access} = req.body;

        try{
            if(req.file !== undefined){
                const { filename: profileImage } = req.file;
                file = profileImage;
            }
            
            const userExists = await User.findOne({ name: name });

            if(userExists){
                return res.json(userExists);
            }
    
            const user = await User.create({
                name,
                email,
                password,
                access,
                profileImage: file
            });
    
            return res.json(user)
        }catch(err){
            return res.status(400).json({error: err})
        }
    },

    async update(req, res){
            
        const { uid } = req.params;
        let data = req.body;
        
        try{
            if(isEmpty(data)) throw "Error: empty values are detecteds";
            
            await database.ref(`/User/${uid}`).update(data, function(err) {
                if (err) {
                    res.send(err);
                } else {
                    res.json({ "message": "successfully update data", "result": true })
                }
            })

        }catch(err){
            return res.status(400).json({err});
        }
      },

    async destroy(req, res){
        const { uid } = req.params;

        try{
            await database.ref(`/User/${uid}`).remove(function(err) {
              if (err) {
                  res.send(err);
              } else {
                  res.json({ message: "success: User deleted.", "result": true })
              }
          })

        }catch(err){
            return res.json({err})
        }

    }
}