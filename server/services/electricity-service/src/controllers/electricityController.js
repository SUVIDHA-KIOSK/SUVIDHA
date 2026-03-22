const { HTTP_STATUS } = require("../constants/httpStatus");
const { getUsageOverview } = require("../services/electricityService");

function getOverview(req, res) {
  const data = getUsageOverview();

  return res.status(HTTP_STATUS.OK).json({
    success: true,
    data,
  });
}

module.exports = {
  getOverview,
};
