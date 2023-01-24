const User = require("../models/User")
const Post = require("../models/Post")
const Comment = require("../models/Comment")
const router = require("express").Router()
const mongoose = require('mongoose')

//create post
router.post('/create', async (req, res) => {
    let details = req.body
    console.log(details)

    try {

        let post = await Post.create(details)
        res.status(200).json(post)

    } catch (error) {
        console.log(error)
        res.status(200).json({ err: error })
    }
})

//delete post
router.delete('/:id/:userId', async (req, res) => {
    let id = req.params.id
    let userId = req.params.userId

    try {
        let post = await Post.findById(id)
        if (post.userId === userId) {
            post.delete()
            res.status(200).json({ msg: "Post deleted" })
        } else if (!post) {
            res.status(200).json({ err: "Post not found" })
        } else {
            res.status(200).json({ err: "You can only delete your post" })
        }
    } catch (error) {
        console.log(error)
        res.status(200).json({ err: error })
    }
})

//like a post
router.put('/like/:id/:userId', async (req, res) => {
    let id = req.params.id

    try {
        let post = await Post.findById(id)
        if (post.likes.includes(req.params.userId)) {
            await post.updateOne({ $pull: { likes: mongoose.Types.ObjectId(req.params.userId) } })
            res.status(200).json({ msg: "Unliked the post" })
        } else {
            await post.updateOne({ $push: { likes: mongoose.Types.ObjectId(req.params.userId) } })
            res.status(200).json({ msg: "Liked the post" })
        }

    } catch (error) {
        console.log(error)
        res.status(200).json({ err: error })
    }
})

//get all post of a user
router.get('/all/:id', async (req, res) => {
    let id = req.params.id

    try {
        let posts = await Post.find({ userId: id }).populate('userId')
        res.status(200).json(posts)

    } catch (error) {
        console.log(error)
        res.status(200).json({ err: error })
    }
})

//get all post
router.get('/all', async (req, res) => {
    try {

        let posts = await Post.find().populate('userId')
        res.status(200).json(posts)

    } catch (error) {
        console.log(error)
        res.status(200).json({ err: error })
    }
})

//search
router.get('/search', async (req, res) => {
    const query = req.query.query

    let results = {}

    const content = {
        $or: [
            { desc: { $regex: query, $options: 'i' } }
        ]
    }
    const contentUser = {
        $or: [
            { username: { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } },
        ]
    }

    try {

        let postResults = await Post.find(content).populate('userId')
        let userResults = await User.find(contentUser)
        results.posts = postResults
        results.users = userResults
        res.status(200).json(results)

    } catch (error) {
        res.json({ error: error })
        console.log(error)
    }
})

//add a comment
router.post('/comment/add', async (req, res) => {
    let userId = req.body.id;
    let desc = req.body.desc;
    let postId = req.body.postId;

    try {

        let comment = await Comment.create({ user: userId, postId: postId, desc: desc })
        res.status(200).json(comment)

    } catch (error) {
        console.log(error)
        res.status(200).json({ err: error })
    }
})

//get Comments
router.get('/comment/get/:id', async (req, res) => {
    let id = req.params.id

    try {

        let comments = await Comment.find({ postId: id }).populate('user')
        res.status(200).json(comments)

    } catch (error) {
        console.log(error)
        res.status(200).json({ err: error })
    }
})

//get a post
router.get('/getOne/:id', async (req, res) => {
    let id = req.params.id
    try {

        let post = await Post.findById(id).populate('userId')
        res.status(200).json(post)

    } catch (error) {
        console.log(error)
        res.status(200).json({ err: error })
    }
})

module.exports = router