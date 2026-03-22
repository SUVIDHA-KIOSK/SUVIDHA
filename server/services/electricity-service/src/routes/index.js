const express = require("express");
const electricityRoutes = require("./electricityRoutes");

const router = express.Router();

router.use("/api/v1/electricity", electricityRoutes);

module.exports = router;
