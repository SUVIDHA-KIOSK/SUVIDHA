const { HTTP_STATUS } = require("../constants/httpStatus");
const { getOverview } = require("../services/gasDistributionService");

function getServiceOverview(req, res) {
  const data = getOverview();

  return res.status(HTTP_STATUS.OK).json({
    success: true,
    data,
  });
}

module.exports = {
  getServiceOverview,
};
