const jwt = require("jsonwebtoken");
const { prisma } = require("../lib/prisma");
const { issueOtp, verifyOtp, sendOtpEmail } = require("./otpService");
const ApiError = require("../utils/apiError");
const {
  validateIdentifier,
  getUserLookupClause,
} = require("../utils/identifier");
const { jwtSecret, jwtExpiresIn } = require("../config/env");

async function requestLoginOtp({ identifierType, identifierValue }) {
  const validationError = validateIdentifier(identifierType, identifierValue);
  if (validationError) {
    throw new ApiError(400, "INVALID_IDENTIFIER", validationError);
  }

  const user = await prisma.user.findUnique({
    where: getUserLookupClause(identifierType, identifierValue),
    select: {
      consumerId: true,
      fullName: true,
      email: true,
    },
  });

  if (!user) {
    throw new ApiError(
      404,
      "USER_NOT_FOUND",
      "No user found for the given identifier",
    );
  }

  const otpPayload = await issueOtp(
    identifierType,
    identifierValue,
    user.consumerId,
  );

  try {
    await sendOtpEmail({
      email: user.email,
      name: user.fullName,
      otp: otpPayload.otp,
    });
  } catch (error) {
    throw new ApiError(
      502,
      "OTP_DELIVERY_FAILED",
      "Failed to send OTP using provider",
      { reason: error.message },
    );
  }

  return {
    identifierType,
    identifierValue,
    consumerId: user.consumerId,
    otpExpiresAt: otpPayload.expiresAt,
    otp: process.env.NODE_ENV === "development" ? otpPayload.otp : undefined,
  };
}

async function verifyLoginOtp({ identifierType, identifierValue, otp }) {
  const validationError = validateIdentifier(identifierType, identifierValue);
  if (validationError) {
    throw new ApiError(400, "INVALID_IDENTIFIER", validationError);
  }

  if (!/^\d{6}$/.test(otp || "")) {
    throw new ApiError(
      400,
      "INVALID_OTP",
      "otp must be a 6 digit numeric string",
    );
  }

  const user = await prisma.user.findUnique({
    where: getUserLookupClause(identifierType, identifierValue),
    select: {
      consumerId: true,
      fullName: true,
    },
  });

  if (!user) {
    throw new ApiError(
      404,
      "USER_NOT_FOUND",
      "No user found for the given identifier",
    );
  }

  const otpValid = await verifyOtp(
    identifierType,
    identifierValue,
    otp,
    user.consumerId,
  );
  if (!otpValid.ok) {
    throw new ApiError(401, otpValid.code, otpValid.message);
  }

  const token = jwt.sign(
    {
      sub: user.consumerId,
      identifierType,
    },
    jwtSecret,
    { expiresIn: jwtExpiresIn },
  );

  const decoded = jwt.decode(token);
  const expiry = new Date(decoded.exp * 1000);

  await prisma.userSession.create({
    data: {
      consumerId: user.consumerId,
      token,
      expiry,
    },
  });

  return {
    accessToken: token,
    tokenType: "Bearer",
    expiresAt: expiry.toISOString(),
    user: {
      consumerId: user.consumerId,
      fullName: user.fullName,
    },
  };
}

async function getProfileByToken(authorizationHeader) {
  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    throw new ApiError(
      401,
      "UNAUTHORIZED",
      "Missing or invalid Authorization header",
    );
  }

  const token = authorizationHeader.slice("Bearer ".length).trim();

  let decoded;
  try {
    decoded = jwt.verify(token, jwtSecret);
  } catch {
    throw new ApiError(401, "INVALID_TOKEN", "Token is invalid or expired");
  }

  const consumerId = decoded.sub;
  if (!consumerId) {
    throw new ApiError(401, "INVALID_TOKEN", "Token subject is missing");
  }

  const activeSession = await prisma.userSession.findUnique({
    where: { token },
    select: { id: true, expiry: true },
  });

  if (!activeSession || new Date() > activeSession.expiry) {
    throw new ApiError(401, "SESSION_EXPIRED", "Session is invalid or expired");
  }

  const user = await prisma.user.findUnique({
    where: { consumerId },
    select: {
      consumerId: true,
      fullName: true,
      mobile: true,
      aadhar: true,
      email: true,
      dob: true,
      gender: true,
      kycStatus: true,
      connectionType: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new ApiError(404, "USER_NOT_FOUND", "User profile not found");
  }

  return {
    ...user,
    dob: user.dob ? user.dob.toISOString().split("T")[0] : null,
    tokenExpiresAt: activeSession.expiry.toISOString(),
  };
}

module.exports = {
  requestLoginOtp,
  verifyLoginOtp,
  getProfileByToken,
};
