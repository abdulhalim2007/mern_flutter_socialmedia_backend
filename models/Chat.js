const mongoose = require('mongoose')

const ChatSchema = new mongoose.Schema({
    user1: { type: mongoose.Types.ObjectId, ref: 'User' },
    user2: { type: mongoose.Types.ObjectId, ref: 'User' },
    chatName: [{ type: String }],
}, { timestamps: true })

module.exports = mongoose.model('Chat', ChatSchema)