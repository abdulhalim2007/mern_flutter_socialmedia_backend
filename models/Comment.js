const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema({
    user: { type: String, required: true, ref: 'User' },
    postId: { type: String, required: true },
    desc: { type: String, required: true, max: 10000 }
}, { timestamps: true })

module.exports = mongoose.model('Comments', CommentSchema)