const express = require('express');
const expenseRoutes = express.Router();
const {addExpense, updateExpense} = require("../expenses/expenseController");
const authenticateJWT = require("../../libraries/authenticator/jwtAuthenticator");

expenseRoutes.post("/expenses", authenticateJWT, addExpense);
expenseRoutes.put("/expenses/:id", authenticateJWT, updateExpense);

module.exports = {expenseRoutes};