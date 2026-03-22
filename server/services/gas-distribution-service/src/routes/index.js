const express = require("express");
const gasDistributionRoutes = require("./gasDistributionRoutes");

const router = express.Router();

router.use("/api/v1/gas-distribution", gasDistributionRoutes);

module.exports = router;
