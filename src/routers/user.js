
const express = require('express')
const User = require('../models/User')
const auth = require('../middleware/auth')
const jwt = require('jsonwebtoken')

const router = express.Router()

router.post('/users/new', async (req, res) => {
    // Create a new user
    try {
        const user = new User(req.body)
        await user.save()
        res.status(201).send({ res: "success" })
    } catch (error) {
        res.status(400).send({ res:error })
    }
})

router.post('/users/login', async(req, res) => {
    //Login a registered user
    try {
        const { email, password } = req.body
        const user = await User.findByCredentials(email, password)
        if (!user) {
            return res.status(401).send({error: 'Login failed! Check authentication credentials'})
        }
        const refreshToken = await user.generateRefreshToken()
        const accessToken = await user.generateAccessToken()
        res.send({ refresh: refreshToken,access: accessToken })
    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.get('/users/me',async(req, res) => {
    var startDate = new Date(),
        endDate = new Date()
    startDate.setDate(startDate.getDate()-1)
    const token = req.header('Authorization').replace('Bearer ', '')
    const data = jwt.verify(token, process.env.JWT_KEY_Refresh)
    try {
        const user = await User.findOne({ _id: data._id, 'tokens.token': token })
        if (user && data._time >= startDate.getTime() && data._time <= endDate.getTime()) {
            const accessToken = await user.generateAccessToken()
            res.send({ access: accessToken})
        } else {
            throw new Error()
        }
    } catch (error) {
        res.status(401).send({ error: 'Not authorized to access this resource' })
    }
    // View logged in user profile
})


router.post('/users/me/logout', auth, async (req, res) => {
    // Log user out of the application
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token
        })
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send(error)
    }
})

router.post('/users/me/logoutall', auth, async(req, res) => {
    // Log user out of all devices
    try {
        req.user.tokens.splice(0, req.user.tokens.length)
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router
