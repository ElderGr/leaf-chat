const User = require('../models/User');
const jwt = require('jsonwebtoken');

module.exports = {
    async login(req, res){
        const { email, password } = req.body;
        
        const targetUser = await User.findOne({
            email,
            password
        });
        if(targetUser){
            const { createdAt, updateAt, __v, ...dataUser } = targetUser;
            var token = jwt.sign( dataUser , 'shhhhhh');
            return res.json({token})
        }else {
            return res.status(400).json({error: 'Login not found, check email and password again'})
        }
    }
}