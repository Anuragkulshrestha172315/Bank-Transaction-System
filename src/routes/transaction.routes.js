const { Router } = require('express');
const { authMiddleware, authSystemUserMiddleware } = require('../middleware/auth.middleware');
const transactionController = require('../controller/transaction.controller')
const transactionRoutes = Router();

transactionRoutes.post("/", authMiddleware , transactionController.createTransaction);
transactionRoutes.post("/system/initial-funds", authSystemUserMiddleware, transactionController.createInitialFundsTransaction);

module.exports = transactionRoutes;