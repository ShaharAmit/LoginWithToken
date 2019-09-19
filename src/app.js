const express = require('express'),
    userRouter = require('./routers/user'),
    searchRouter = require('./routers/user'),
    port = process.env.PORT,
cookieParser = require('cookie-parser')
require('./db/db')

const app = express()

app.use(express.json())
app.use(cookieParser(process.env.cookieSecret))
app.use(userRouter)
app.use(searchRouter)

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
}) 