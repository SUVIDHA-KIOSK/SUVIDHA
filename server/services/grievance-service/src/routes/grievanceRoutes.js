const express = require("express");
const { getServiceOverview } = require("../controllers/grievanceController");

const router = express.Router();

router.get("/overview", getServiceOverview);

module.exports = router;
