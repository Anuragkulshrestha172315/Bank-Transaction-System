const express = require('express')
const cookieParser = require('cookie-parser') 

const app = express();
app.use(express.json())
app.use(cookieParser())

const authRouter = require('./routes/auth.route')
const accountRouter = require('./routes/account.routes')
const transactionRoutes = require('./routes/transaction.routes')

app.use("/api/auth", authRouter)
app.use("/api/account", accountRouter)

module.exports = app