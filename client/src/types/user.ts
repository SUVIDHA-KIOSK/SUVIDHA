export type IdentifierType = "M" | "A" | "C";

export interface AuthUser {
  consumerId: string;
  fullName: string;
  mobile?: string | null;
  aadhar?: string | null;
  email?: string | null;
  dob?: string | null;
  gender?: "M" | "F" | "O";
  kycStatus?: "PENDING" | "VERIFIED" | "REJECTED";
  connectionType?: "DOMESTIC" | "COMMERCIAL";
  isActive?: boolean;
  identifierType?: IdentifierType;
  identifierValue?: string;
  tokenIssuedAt?: string;
  tokenExpiresAt?: string;
}

export interface RequestOtpPayload {
  identifierType: IdentifierType;
  identifierValue: string;
}

export interface RequestOtpData {
  identifierType: IdentifierType;
  identifierValue: string;
  consumerId: string;
  otpExpiresAt: string;
  otp?: string;
}

export interface VerifyOtpPayload {
  identifierType: IdentifierType;
  identifierValue: string;
  otp: string;
}

export interface VerifyOtpData {
  accessToken: string;
  tokenType: "Bearer";
  expiresAt: string;
  user: AuthUser;
}

export interface ProfileData {
  consumerId: string;
  fullName: string;
  mobile: string;
  aadhar: string | null;
  email: string;
  dob: string | null;
  gender: "M" | "F" | "O";
  kycStatus: "PENDING" | "VERIFIED" | "REJECTED";
  connectionType: "DOMESTIC" | "COMMERCIAL";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  tokenExpiresAt: string;
}
