const express = require("express");
const notificationRoutes = require("./notificationRoutes");

const router = express.Router();

router.use("/api/v1/notification", notificationRoutes);

module.exports = router;
