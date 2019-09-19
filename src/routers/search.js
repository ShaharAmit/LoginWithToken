
const express = require('express')
const auth = require('../middleware/auth')

const router = express.Router()

router.get('/search',auth, async(req, res) => {
    try {
        // if (req.body) {
        //     if (req.user.quries.contains(req.body))
        //      req.user.quries.concat(req.body)

        // if (user && data._time >= startDate.getTime() && data._time <= endDate.getTime()) {
        //     const accessToken = await user.generateAccessToken()
        //     res.send({ access: accessToken})
        // } else {
        //     throw new Error()
        // }
    } catch (error) {
        res.status(401).send({ error: 'Not authorized to access this resource' })
    }
})

module.exports = router 
