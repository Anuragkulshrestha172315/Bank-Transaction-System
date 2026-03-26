const transactionModel = require('../models/transaction.model')
const ledgerModel = require("../models/ledger.model")
const accoutModel = require("../models/account.model")
const emailService = require("../Services/email.service")
const { default: mongoose } = require('mongoose')

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
          idempotencyKey: idempotencyKey                                                                                      
    })

    if(isTransactionAlreadyExists){
        if(isTransactionAlreadyExists.status === "COMPLETED"){
            return res.status(200).json({
                message: "Transaction is already processed",
                transaction: isTransactionAlreadyExists
            })
        }

        if(isTransactionAlreadyExists.status === "PENDING"){
            return res.status(200).json({
                message: "Transaction is processed pending",
            })
        }

        if(isTransactionAlreadyExists.status === "FAILED"){
            return res.status(200).json({
                message: "Transaction is processed Failed",
                transaction: isTransactionAlreadyExists
            })
        }

        if(isTransactionAlreadyExists.status === "COMPLETED"){
            return res.status(500).json({
                message: "Transaction was reversed, please retry",
            })
        }
    }


    //Check account status

    if(fromUserAccount.status !== "ACTIVE" || toUserAccount !== "ACTIVE"){
        return res.status(400).json({
            message: "Both fromAccount and toAccount must be ACTIVE to process transaction"
        })
    }


    // Derive sender balance from ledger

    const balance = await fromUserAccount.getBalance()
    if(balance < amount){
       return res.status(400).json({
            messaage: `Insufficient balance. Current balance is ${balance}. requested amount is ${amount}`
        })
    }



    //Create transaction

    const session = await mongoose.startSession()
    session.startTransaction()

    const transaction = await transactionModel.create({
        fromAccount,
        toAccount,
        amount,
        idempotencyKey,
        status: "PENDING"
    }, {session})

    const debitLedgerEntry = await ledgerModel.create({
        account:  toAccount,
        amount: amount,
        transaction: transaction._id,
        type: "DEBIT"
    }, {session})

    const creditLedgerEntry = await ledgerModel.create({
        account:  toAccount,
        amount: amount,
        transaction: transaction._id,
        type: "CREDIT"
    }, {session})

    transaction.status = "COMPLETED" 
    await transaction.save({session})



    await session.commitTransaction()
    session.endSession()



}