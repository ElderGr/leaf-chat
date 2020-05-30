const database = require('../services/firebase');
const jwt = require('jsonwebtoken')


module.exports = {

    async store(req, res){

        const { email, password }  = req.body;
        
        database.ref('/User').on('value', function(snapshot) {
            try{
                var user = '';
                snapshot.forEach(item =>{
                    if(item.val().email === email && item.val().password === password){
                        user = item.val();
                    }
                })

                if(user !== ''){
                    var token = jwt.sign(user, 'shhhhhh');
                    return res.json({token : token})
                }else{
                    return res.status(400).json({error: 'Login not found, check email and password again'})
                }
            }catch(e){
                return res.status(400).json({error: e}) 
            }
        }) 
    }
}