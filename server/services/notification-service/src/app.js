const express = require("express");
const routes = require("./routes");
const {
  rootHandler,
  healthHandler,
} = require("./controllers/systemController");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(express.json());

app.get("/", rootHandler);
app.get("/health", healthHandler);

app.use(routes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
