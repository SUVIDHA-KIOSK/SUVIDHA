const port = Number(process.env.PORT) || 4005;
const nodeEnv = process.env.NODE_ENV || "development";

module.exports = {
  port,
  nodeEnv,
};
