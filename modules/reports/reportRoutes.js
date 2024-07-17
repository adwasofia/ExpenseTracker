const express = require('express');
const reportRoutes = express.Router();
const {monthlyReport} = require("../reports/reportController");
const authenticateJWT = require("../../libraries/authenticator/jwtAuthenticator");

reportRoutes.get("/reports/monthly", authenticateJWT, monthlyReport);

module.exports = {reportRoutes};