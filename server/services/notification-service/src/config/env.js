const port = Number(process.env.PORT) || 4008;
const nodeEnv = process.env.NODE_ENV || "development";

module.exports = {
  port,
  nodeEnv,
};
