const { Sequelize } = require('sequelize');
const { db } = require("../../config/database");

const { DataTypes } = Sequelize;

const Expense = db.define('expenses', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    category: {
        type: DataTypes.ENUM('Groceries', 'Leisure', 'Electronics', 'Utilities', 'Clothing', 'Health', 'Others'),
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

module.exports = Expense;
