const { HTTP_STATUS } = require("../constants/httpStatus");

function rootHandler(req, res) {
  return res.status(HTTP_STATUS.OK).json({
    service: "water",
    status: "running",
  });
}

function healthHandler(req, res) {
  return res.status(HTTP_STATUS.OK).json({
    status: "OK",
    service: "water",
    timestamp: new Date().toISOString(),
  });
}

module.exports = {
  rootHandler,
  healthHandler,
};
