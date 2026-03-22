const express = require("express");
const wasteManagementRoutes = require("./wasteManagementRoutes");

const router = express.Router();

router.use("/api/v1/waste-management", wasteManagementRoutes);

module.exports = router;
