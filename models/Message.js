const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({
    chatId: { type: String, ref: 'Chat' },
    from: { type: String, ref: 'User' },
    to: { type: String, ref: 'User' },
    text: [{ type: String }],
}, { timestamps: true })

module.exports = mongoose.model('Message', MessageSchema)