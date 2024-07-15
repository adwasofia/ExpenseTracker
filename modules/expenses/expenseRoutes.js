const express = require('express');
const expenseRoutes = express.Router();
const {addExpense} = require("../expenses/expenseController");
const authenticateJWT = require("../../libraries/authenticator/jwtAuthenticator");

expenseRoutes.post('/expenses', authenticateJWT, addExpense);

module.exports = {expenseRoutes};