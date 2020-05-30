const database = require('../services/firebase');

module.exports = {
    async store(req, res){
        const {owner, content} = req.body;
        const { postId } = req.params;

        let commentStruct = {
            content,
            owner,
            timestamp: new Date().getTime()
        }

        await database.ref(`Post/${postId}/comments`).push(commentStruct);

        return res.json({ok: 'e'})
    }
}