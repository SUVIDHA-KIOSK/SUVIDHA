interface JwtPayload {
  sub?: string;
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}

export function parseJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    const base64Payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const decodedPayload = atob(base64Payload);
    return JSON.parse(decodedPayload) as JwtPayload;
  } catch {
    return null;
  }
}
