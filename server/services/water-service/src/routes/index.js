const express = require("express");
const waterRoutes = require("./waterRoutes");

const router = express.Router();

router.use("/api/v1/water", waterRoutes);

module.exports = router;
