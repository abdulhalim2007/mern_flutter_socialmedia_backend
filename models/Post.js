const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    userId: { type: String, required: true, ref: 'User' },
    desc: { type: String, max: 10000000 },
    img: { type: String },
    likes: { type: Array, default: [] }
}, { timestamps: true })

module.exports = mongoose.model('Post', PostSchema)