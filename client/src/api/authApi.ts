import { env } from "../config/env";
import type {
  ProfileData,
  RequestOtpData,
  RequestOtpPayload,
  VerifyOtpData,
  VerifyOtpPayload,
} from "../types/user";
import { request } from "./httpClient";

const authBasePath = env.authApiPrefix;

export const authApi = {
  requestOtp(payload: RequestOtpPayload) {
    return request<RequestOtpData>(`${authBasePath}/login/otp`, {
      method: "POST",
      body: payload,
    });
  },

  verifyOtp(payload: VerifyOtpPayload) {
    return request<VerifyOtpData>(`${authBasePath}/login/verify`, {
      method: "POST",
      body: payload,
    });
  },

  getProfile(token: string) {
    return request<ProfileData>(`${authBasePath}/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
