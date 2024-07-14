const express = require('express');
const userRoutes = express.Router();
const {signup, login, logout} = require("../users/userController");

userRoutes.post("/signup", signup);
userRoutes.post("/login", login);
userRoutes.post("/logout", logout);

module.exports = {userRoutes};