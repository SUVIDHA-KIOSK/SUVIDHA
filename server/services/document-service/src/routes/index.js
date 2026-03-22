const express = require("express");
const documentRoutes = require("./documentRoutes");

const router = express.Router();

router.use("/api/v1/document", documentRoutes);

module.exports = router;
