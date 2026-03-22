const express = require("express");
const { getServiceOverview } = require("../controllers/gasDistributionController");

const router = express.Router();

router.get("/overview", getServiceOverview);

module.exports = router;
