const User = require("../models/User")
const router = require("express").Router()
const bcrypt = require('bcrypt')

//register
router.post('/register', async (req, res) => {
    let details = req.body;
    let salt = await bcrypt.genSalt(5)
    let hash = await bcrypt.hash(details.password, salt)
    details.password = hash
    try {
        let ifUsernameExist = await User.findOne({ username: details.username })
        let ifEmailExist = await User.findOne({ email: details.email })
        if (ifUsernameExist) return res.status(200).json({ msg: "Username Already exists" })
        if (ifEmailExist) return res.status(200).json({ msg: "Email Already exists" })
        if (!ifEmailExist && !ifUsernameExist) {
            let newUser = await User.create(details)
            res.status(200).json(newUser)
        }
    } catch (error) {
        console.log(error)
        res.status(200).json({ err: error })
    }
})

//login
router.post('/login', async (req, res) => {
    let details = req.body;

    try {
        let user = await User.findOne({ email: details.email })
        if (!user) return res.status(200).json({ msg: "Incorrect email" })
        let isPasswordCorrect = await bcrypt.compare(details.password, user.password)
        if (isPasswordCorrect) {
            res.status(200).json(user)
        } else {
            res.status(200).json({ msg: 'Incorrect password' })
        }
    } catch (error) {
        console.log(error)
        res.status(200).json({ err: error })
    }
})


module.exports = router