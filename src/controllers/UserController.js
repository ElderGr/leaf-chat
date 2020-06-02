const User = require('../models/User');

module.exports = {

    async index(req, res) {
        try {
            const users = await User.find();

            return res.json(users)
        } catch (err) {
            return res.status(400).json({ err: err });
        }
    },

    async show(req, res) {
        const { uid } = req.params;

        try {
            const user = await User.find({
                _id: uid
            })
            
            return res.json(user)
        } catch (err) {
            return res.status(400).json({err})
        }
    },

    async store(req, res) {
        let file;
        const { name, email, password, access } = req.body;

        try {
            if (req.file !== undefined) {
                const { filename: profileImage } = req.file;
                file = profileImage;
            }

            const userExists = await User.findOne({ email: email });

            if (userExists) {
                return res.status(400).json({ error: 'user already exists!' })
            }

            const user = await User.create({
                name,
                email,
                password,
                access,
                profileImage: req.file !== undefined ? `http://localhost:5000/files/${src}` : ''
            });

            return res.json(user)
        } catch (err) {
            return res.status(400).json({ error: err })
        }
    },

    async update(req, res) {

        let file; 
        const { name, email, password, access } = req.body;

        if (req.file !== undefined) {
            const { filename: profileImage } = req.file;
            file = profileImage;
        }
        
        const { uid } = req.params;

        const userExists = await User.findOne({ _id: uid });

        if (!userExists) {
            return res.status(400).json({ error: "User not exist" });
        }

        const user = await User.updateOne({_id: uid},
        {
            name,
            email,
            password,
            access,
            profileImage: req.file !== undefined ? `http://localhost:5000/files/${file}` : '' 
        })

        return res.json(user);
    },

    async destroy(req, res) {
        const { uid } = req.params;

        await User.deleteOne({ _id: uid });

        return res.json({message: "User Deleted"})
    }
}