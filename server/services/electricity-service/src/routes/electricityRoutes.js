const express = require("express");
const { getOverview } = require("../controllers/electricityController");

const router = express.Router();

router.get("/overview", getOverview);

module.exports = router;
