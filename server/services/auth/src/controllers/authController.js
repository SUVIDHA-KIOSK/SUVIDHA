const {
  requestLoginOtp,
  verifyLoginOtp,
  getProfileByToken,
} = require("../services/authService");
const { ok } = require("../utils/apiResponse");

async function requestOtp(req, res, next) {
  try {
    const { identifierType, identifierValue } = req.body;
    const data = await requestLoginOtp({ identifierType, identifierValue });
    return ok(res, data, "OTP generated", 200);
  } catch (error) {
    return next(error);
  }
}

async function verifyOtp(req, res, next) {
  try {
    const { identifierType, identifierValue, otp } = req.body;
    const data = await verifyLoginOtp({ identifierType, identifierValue, otp });
    return ok(res, data, "OTP verified. Login successful", 200);
  } catch (error) {
    return next(error);
  }
}

async function getProfile(req, res, next) {
  try {
    const data = await getProfileByToken(req.headers.authorization);
    return ok(res, data, "Profile fetched", 200);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  requestOtp,
  verifyOtp,
  getProfile,
};
