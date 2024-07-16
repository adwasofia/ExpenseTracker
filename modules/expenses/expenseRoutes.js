const express = require('express');
const expenseRoutes = express.Router();
const {addExpense, getExpense, getExpenseById, updateExpense} = require("../expenses/expenseController");
const authenticateJWT = require("../../libraries/authenticator/jwtAuthenticator");

expenseRoutes.post("/expenses", authenticateJWT, addExpense);
expenseRoutes.put("/expenses/:id", authenticateJWT, updateExpense);
expenseRoutes.get("/expenses", authenticateJWT, getExpense);
expenseRoutes.get("/expenses/:id", authenticateJWT, getExpenseById);

module.exports = {expenseRoutes};