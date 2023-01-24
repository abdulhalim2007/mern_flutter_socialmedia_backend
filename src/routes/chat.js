const Chat = require('../models/Chat')
const Message = require('../models/Message')

const router = require('express').Router()

//create
router.post('/add', async (req, res) => {
    let user1 = req.body.id1
    let user2 = req.body.id2
    let chatName = req.body.name

    try {

        let chat1 = await Chat.find({ user1: user1, user2: user2 })
        console.log(chat1)
        let chat2 = await Chat.find({ user1: user2, user2: user1 })
        console.log(chat2)

        if (!chat1.length && !chat2.length) {
            let chat = await Chat.create({
                user1: user1,
                user2: user2,
                chatName: chatName,
            })
            res.status(200).json(chat)
        } else {
            res.status(200).json({ msg: "Chat already exist" })
        }

    } catch (error) {
        console.log(error)
        res.status(200).json({ err: error })
    }
})

//get All chats of a user
router.get('/get/:id', async (req, res) => {
    let id = req.params.id;

    try {
        let chat1 = await Chat.find({ user1: id }).populate('user1').populate('user2')
        let chat2 = await Chat.find({ user2: id }).populate('user1').populate('user2')
        let chats = chat1.concat(chat2);
        res.status(200).json(chats)

    } catch (error) {
        console.log(error)
        res.status(200).json({ err: error })
    }

})

//get one Chat
router.get('/:id', async (req, res) => {
    let id = req.params.id

    try {

        let chat = await Chat.findById(id).populate('user1').populate('user2')
        res.status(200).json(chat)

    } catch (error) {
        console.log(error)
        res.status(200).json({ err: error })
    }

})

//add message
router.post('/message/add', async (req, res) => {
    let from = req.body.from
    let to = req.body.to
    let text = req.body.text
    let chatId = req.body.chatId

    try {

        let msg = await Message.create({
            chatId: chatId,
            from: from,
            to: to,
            text: text
        })
        console.log('hhshfdshfdskjfsdjhfjsdkkfh')
        res.status(200).json(msg)

    } catch (error) {
        console.log(error)
        res.status(200).json({ err: error })
    }
})

//get messages
router.get('/message/get/:id', async (req, res) => {
    let id = req.params.id

    try {

        let messages = await Message.find({ chatId: id })
        // console.log(messages) 
        res.status(200).json(messages)

    } catch (error) {
        console.log(error)
        res.status(200).json({ err: error })
    }
})

module.exports = router