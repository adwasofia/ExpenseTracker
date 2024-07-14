const express = require("express");
const { startdb } = require("./config/database");
const authenticateJWT = require("./libraries/authenticator/jwtAuthenticator");
// const {} = require("./modules/users/userRoutes");
// const {} = require("./modules/expenses/expenseRoutes");

const app = express();

app.use(express.json());
// app.use(router);

startdb();

app.listen(process.env.PORT, (error) => {
    if (error) {
        console.log("Error!");
        console.log(`Error: ${error}`);
    } else {
        console.log(`Server berjalan di port ${process.env.PORT}`);
    }
});

// authentication endpoint
app.get("/auth-endpoint", authenticateJWT, (request, response) => {
    response.json({ message: "You are authorized to access me" });
});

module.exports = { app };