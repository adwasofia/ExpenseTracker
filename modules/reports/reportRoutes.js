const express = require('express');
const reportRoutes = express.Router();
const {monthlyReport, yearlyReport, categoryReport} = require("../reports/reportController");
const authenticateJWT = require("../../libraries/authenticator/jwtAuthenticator");

reportRoutes.get("/reports/monthly", authenticateJWT, monthlyReport);
reportRoutes.get("/reports/yearly", authenticateJWT, yearlyReport);
reportRoutes.get("/reports/category", authenticateJWT, categoryReport);

module.exports = {reportRoutes};