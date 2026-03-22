const express = require("express");
const { getServiceOverview } = require("../controllers/wasteManagementController");

const router = express.Router();

router.get("/overview", getServiceOverview);

module.exports = router;
