const express = require("express");
const { getServiceOverview } = require("../controllers/documentController");

const router = express.Router();

router.get("/overview", getServiceOverview);

module.exports = router;
