const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    fullName: { type: String, required: true, min: 2, max: 60 },
    username: { type: String, required: true, min: 3, max: 20, unique: true },
    email: { type: String, required: true, max: 50, unique: true },
    password: { type: String, required: true, min: 6 },
    pinnedPost: { type: String, ref: 'Post' },
    profilePicture: { type: String, default: "person/noAvatar.jpg" },
    coverPicture: { type: String, default: "person/noCover.jpg" },
    followers: { type: Array, default: [] },
    following: { type: Array, default: [] },
}, { timestamps: true })

module.exports = mongoose.model('User', UserSchema)