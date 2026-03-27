const { Router } = require('express');

const transactionRoutes = Router();

transactionRoutes.post("/", (req, res) => {
    res.send("Transaction route working");
});

module.exports = transactionRoutes;