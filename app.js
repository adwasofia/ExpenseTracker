const express = require("express");
const { startdb } = require("./config/database");
const authenticateJWT = require("./libraries/authenticator/jwtAuthenticator");
const {userRoutes} = require("./modules/users/userRoutes");
// const {} = require("./modules/expenses/expenseRoutes");

const app = express();

app.use(express.json());
app.use(userRoutes);

startdb();

app.listen(process.env.PORT, (error) => {
    if (error) {
        console.log("Error!");
        console.log(`Error: ${error}`);
    } else {
        console.log(`Server berjalan di port ${process.env.PORT}`);
    }
});

app.get('/', async (req, res) => {
    res.status(200).json({
        message: "Welcome to Expense Tracker!"
    })
});

// authentication endpoint
app.get("/auth-endpoint", authenticateJWT, (request, response) => {
    response.json({ message: "You are authorized to access me" });
});

module.exports = { app };