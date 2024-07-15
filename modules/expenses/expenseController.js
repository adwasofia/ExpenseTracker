const Expense = require("./expenseModel");
//const authenticateJWT = require("../../libraries/authenticator/jwtAuthenticator");

const addExpense = async (req, res) => {
    const {category, amount, description, date} = req.body;
    try {
        const newExpense = await Expense.create({
            user_id: req.user.id,
            category,
            amount,
            description,
            date
        });
        res.status(200).json({
            message: "A new expense is successfully added.",
            details: newExpense
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal server error.",
            details: error.message
        })
    }

};

module.exports = {addExpense};