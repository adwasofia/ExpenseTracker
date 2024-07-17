const Expense = require("../expenses/expenseModel");
const { Op } = require('sequelize');

// Report Endpoints (Protected)
// 1. Monthly Spending Report
// Provides a report of the user's spending for a specific month.
const monthlyReport = async (req, res) => {
    const user_id = req.user.id;
    const { month, year } = req.query;
    if (!user_id || !month || !year) {
        return res.status(400).json({message: "User ID, Month, and Year are required."});
    }
    const startDate = new Date(year, month-1, 1);
    const endDate = new Date(year, month, 0);
    try {
        expenses = await Expense.findAll({
            where: {
                user_id: user_id,
                date: {
                    [Op.between]: [startDate, endDate]
                }
            }
        });
        if (!expenses) {
            return res.status(404).json({message: "Expenses not found."});
        }
        return res.status(200).json(expenses);
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error.",
            details: error.message
        });
    }
}

// 2. Category-wise Spending Report: GET /api/reports/category-spending
// Provides a report of the user's spending by category over a specified period.
const categoryReport = async (req, res) => {
    const user_id = req.user.id;
    const { category, startDate, endDate  } = req.query;
    if (!user_id || !category) {
        return res.status(400).json({message: "User ID and Category are required."});
    }
    const filters = {user_id: user_id, category: category};
    if (startDate && endDate) {
        filters.date = {
            [Op.between]: [new Date(startDate), new Date(endDate)]
        }
    }
    try {
        const expenses = await Expense.findAll({
            where: filters
        });
        if (!expenses) {
            return res.status(404).json({message: "Expenses not found."});
        }
        return res.status(200).json(expenses);
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching expenses.",
            details: error.message
        });
    }
}
// 3. Yearly Spending Report: GET /api/reports/yearly-spending
// Provides a report of the user's spending for a specific year.
// 4. Custom Date Range Report: GET /api/reports/custom-spending
// Provides a report of the user's spending for a custom date range.
// 5. Top Expenses Report: GET /api/reports/top-expenses
// Lists the top N expenses for a specified period.

module.exports = {monthlyReport, categoryReport};