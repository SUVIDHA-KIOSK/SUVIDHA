const express = require("express");
const { getServiceOverview } = require("../controllers/notificationController");

const router = express.Router();

router.get("/overview", getServiceOverview);

module.exports = router;
