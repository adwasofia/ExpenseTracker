const { User } = require("../users/userModel");
const Expense = require("./expenseModel");

const addExpense = async (req, res) => {
    const {category, amount, description, date} = req.body;
    if (!category || !amount || !description || !date) {
        res.status(400).json({
            message: "Category, amount, description, and date are required."
        })
    }
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

const getExpense = async (req, res) => {
    const user_id = req.user.id;
    if (!user_id) {
        res.status(400).json({message: "User ID is required."});
    }
    try {
        const expenses = await Expense.findAll({
            where: {user_id: user_id}
        });
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching expenses.",
            details: error.message
        });
    }
};

const getExpenseById = async (req, res) => {
    const user_id = req.user.id;
    if (!user_id || !req.params.id) {
        res.status(400).json({message: "User ID and Expense ID is required."});
    }
    try {
        const expense = await Expense.findOne({
            where: {user_id: user_id, id: req.params.id}
        });
        res.status(200).json(expense);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching expenses.",
            details: error.message
        });
    }
};

const updateExpense = async (req, res) => {
    const user_id = req.user.id;
    if (!user_id || !req.params.id || !req.body.category || !req.body.amount || !req.body.description || !req.body.date) {
        res.status(400).json({message: "User ID, Expense ID, Category, Amount, Description, and Date are required."});
    }
    let user = await User.findOne({
        where: { id: user_id }
    });
    if (!user) {
        res.status(404).json({message: "User not found."});
    }
    try {
        const expense = await Expense.findOne({
            where: {id: req.params.id, user_id: user_id}
        });
        if (!expense) {
            res.status(404).json({message: "Expense not found."});
        }
        expense.category = req.body.category;
        expense.amount = req.body.amount;
        expense.description = req.body.description;
        expense.date = req.body.date;
        await expense.save();
        res.status(200).json({
            message: "An expense is successfully updated!",
            details: expense
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error.",
            details: error.message
        });
    }
};

module.exports = {addExpense, getExpense, getExpenseById, updateExpense};