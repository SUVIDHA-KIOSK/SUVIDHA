const express = require("express");
const { getServiceOverview } = require("../controllers/paymentGatewayController");

const router = express.Router();

router.get("/overview", getServiceOverview);

module.exports = router;
