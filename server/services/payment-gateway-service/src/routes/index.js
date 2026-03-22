const express = require("express");
const paymentGatewayRoutes = require("./paymentGatewayRoutes");

const router = express.Router();

router.use("/api/v1/payment-gateway", paymentGatewayRoutes);

module.exports = router;
