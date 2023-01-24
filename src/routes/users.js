const User = require("../models/User")
const Post = require("../models/Post")
const router = require("express").Router()
const mongoose = require('mongoose')

//get a user
router.get('/:id/get', async (req, res) => {
    let userId = req.params.id
    try {
        let user = await User.findById(mongoose.Types.ObjectId(userId))
        console.log('hey')
        console.log(user)
        if (user) {
            res.status(200).json(user)
        } else {
            res.status(200).json({ msg: "User not found :(" })
        }
    } catch (error) {
        console.log(error)
        res.status(200).json({ err: error })
    }
})

//get a user
router.get('/:username/getUsername', async (req, res) => {
    let username = req.params.username
    try {
        let user = await User.findOne({ username: username })
        // console.log(user)
        if (user) {
            res.status(200).json(user)
        } else {
            res.status(200).json({ msg: "User not found :(" })
        }
    } catch (error) {
        console.log(error)
        res.status(200).json({ err: error })
    }
})

//follow a user
router.put('/:cid/:userId', async (req, res) => {
    let cid = req.params.cid;
    let userId = req.params.userId;

    try {
        const user = await User.findById(userId)
        const currentUser = await User.findById(cid)

        if (user._id !== currentUser._id) {
            if (!user.followers.includes(cid)) {
                await user.updateOne({ $push: { followers: cid } })
                await currentUser.updateOne({ $push: { following: userId } })
                res.status(200).json({ msg: "User has been followed" })
            } else {
                await user.updateOne({ $pull: { followers: cid } })
                await currentUser.updateOne({ $pull: { following: userId } })
                res.status(200).json({ msg: "User has been unfollowed" })
            }
        }
    } catch (error) {
        console.log(error)
        res.status(200).json({ err: error })
    }
})

//get friends
router.get('/:id', async (req, res) => {
    try {
        let user = await User.findById(req.params.id)
        if (user) {
            let friends = await Promise.all(
                user.following.map(id => User.findById(id))
            )
            let list = [];
            friends.map(friend => {
                const { _id, username, profilePicture } = friend
                list.push({ _id, username, profilePicture })
            })

            res.status(200).json(list)
        }
    } catch (error) {
        console.log(error)
        res.status(200).json({ err: error })
    }
})

//update profile image
router.post('/profile/:id', async (req, res) => {
    let image = req.body.image
    let id = req.params.id

    try {
        let resp = await User.updateOne({ _id: id }, { profilePicture: image })
        res.status(200).json(resp)
    } catch (error) {
        console.log(error)
        res.status(200).json({ err: error })
    }
})

//update cover image
router.post('/cover/:id', async (req, res) => {
    let image = req.body.image
    let id = req.params.id

    try {
        let resp = await User.updateOne({ _id: id }, { coverPicture: image })
        res.status(200).json(resp)
    } catch (error) {
        console.log(error)
        res.status(200).json({ err: error })
    }
})

//pin a post
router.post('/pin/:id/:postId', async (req, res) => {
    let userId = req.params.id
    let postId = req.params.postId
    console.log(postId)

    try {
        let user = await User.findById(userId)
        if (user.pinnedPost == postId) {
            let resp = await User.findOneAndUpdate({ _id: mongoose.Types.ObjectId(userId) }, { pinnedPost: '' })
            res.status(200).json(resp)
        } else {
            let resp = await User.findOneAndUpdate({ _id: mongoose.Types.ObjectId(userId) }, { pinnedPost: postId })
            res.status(200).json(resp)
        }

    } catch (error) {
        console.log(error)
        res.status(200).json({ err: error })
    }

})

//get pinned post
router.get('/:id/pinGet', (req, res) => {
    let id = req.params.id

    try {

        User.findById(id)
            .then(user => {
                if (user.pinnedPost) {
                    Post.findById(user.pinnedPost).populate('userId')
                        .then(post => {
                            res.status(200).json(post)
                        })
                } else {
                    res.status(200).json({ msg: 'No pinned Post' })
                }
            })

    } catch (error) {
        console.log(error)
        res.status(200).json({ err: error })
    }
})

//search
router.get('/search', async (req, res) => {
    const query = req.query.query

    const contentUser = {
        $or: [
            { username: { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } },
            { desc: { $regex: query, $options: 'i' } }
        ]
    }

    try {
        let userResults = await User.find(contentUser)
        res.status(200).json(userResults)

    } catch (error) {
        res.json({ err: error })
        console.log(error)
    }
})

module.exports = router