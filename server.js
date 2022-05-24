const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const mongoose = require('mongoose');
const path = require('path')
const multer = require('multer')
const morgan = require('morgan')
const server = require('http').createServer(app)

const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["*"]
    }
})


mongoose.connect('mongodb+srv://Abdulhalim:jaithunbi123@cluster0.4wjzh.mongodb.net/MernSocialMediaReactAndFlutter?retryWrites=true&w=majority', () => {
    console.log('Database connection successful.')
})

app.use('/images', express.static(path.join(__dirname, "public/images")))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(morgan())
app.use('/auth', require('./routes/auth'))
app.use('/users', require('./routes/users'))
app.use('/post', require('./routes/post'))
app.use('/chat', require('./routes/chat'))

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/posts')
    },
    filename: (req, file, cb) => {
        // console.log(req.body)
        cb(null, file.originalname)
    }
})

const storageForCover = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/person')
    },
    filename: (req, file, cb) => {
        // console.log(req.body)
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage })
app.post('/upload', upload.single('file'), (req, res) => {
    try {
        return res.status(200).send(req.file)
    } catch (err) {
        console.log(err)
    }
})

const uploadForCover = multer({ storage: storageForCover })
app.post('/uploadForCover', uploadForCover.single('file'), (req, res) => {
    try {
        // console.log('hi')
        return res.status(200).send(req.file)
    } catch (err) {
        console.log(err)
        return res.status(200).json({ err: err })
    }
})

io.on('connection', socket => {
    socket.on('userConnected', ({ id, chatId }) => {
        console.log(chatId)
        socket.join(chatId)
    })
    socket.on('newMessage', ({ data, chatId, fromId }) => {
        console.log(chatId)
        socket.to(chatId).emit('newMessage', { data: data, fromId: fromId })
    })
    // socket.on('typing', (chatId, userId) => {
    //     socket.to(chatId).emit('typing', { userId: userId })
    // })
})

server.listen(process.env.PORT, "127.0.0.1", () => {
    console.log('Listening on port 3001....')
})