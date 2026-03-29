const express = require("express")
const authMiddleware = require("../middleware/auth.middleware")
const router = express.Router()
const  accountController = require('../controller/account.controller')

router.post("/", authMiddleware.authMiddleware, accountController.createAccountController)
router.get("/", authMiddleware.authMiddleware, accountController.getUserAccountController)

module.exports = router