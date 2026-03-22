const express = require("express");
const grievanceRoutes = require("./grievanceRoutes");

const router = express.Router();

router.use("/api/v1/grievance", grievanceRoutes);

module.exports = router;
