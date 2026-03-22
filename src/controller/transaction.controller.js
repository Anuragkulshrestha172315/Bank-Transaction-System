const transactionModel = require('../models/transaction.model')
const ledgerModel = require("../models/ledger.model")
const accoutModel = require("../models/account.model")
const emailService = require("../Services/email.service")

async function createTransaction(req, res) {
    const {fromAccount, toAccount, amount, idempotencyKey} = req.body

    if(!fromAccount || !toAccount || !amount || !idempotencyKey){
        return res.status(400).json({
            message: "fromAccount, toAccout, amount, idempotencyKey are required"
        })
    }

    const fromUserAccount = await accoutModel.findOne({
        _id: fromAccount,
    })
    const toUserAccount = await accoutModel.findOne({
        _id: toAccount,
    })
     if(!fromUserAccount || !toUserAccount){
        return res.status(400).json({
            message: "Invalid fromAccount or to Account "
        })
    }

    const isTransactionAlreadyExists = await transactionModel.findOne({
        
    })
}