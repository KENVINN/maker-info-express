import crypto from "node:crypto";

import { env } from "./env.js";

export const SESSION_COOKIE_NAME = "maker_info_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12;

function signValue(value) {
  return crypto.createHmac("sha256", env.sessionSecret).update(value).digest("base64url");
}

function parseCookies(cookieHeader = "") {
  return cookieHeader
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .reduce((acc, part) => {
      const separatorIndex = part.indexOf("=");

      if (separatorIndex === -1) {
        return acc;
      }

      const key = part.slice(0, separatorIndex);
      const value = decodeURIComponent(part.slice(separatorIndex + 1));

      acc[key] = value;
      return acc;
    }, {});
}

function safeEqual(left, right) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

export function issueSessionToken(payload) {
  const sessionPayload = {
    ...payload,
    issuedAt: Date.now(),
    expiresAt: Date.now() + SESSION_TTL_MS,
  };

  const encoded = Buffer.from(JSON.stringify(sessionPayload), "utf8").toString("base64url");
  const signature = signValue(encoded);

  return `${encoded}.${signature}`;
}

export function readSessionFromRequest(req) {
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies[SESSION_COOKIE_NAME];

  if (!token) {
    return null;
  }

  const [encoded, signature] = token.split(".");

  if (!encoded || !signature || !safeEqual(signValue(encoded), signature)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));

    if (!payload?.expiresAt || payload.expiresAt < Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function setSessionCookie(res, payload) {
  res.cookie(SESSION_COOKIE_NAME, issueSessionToken(payload), {
    httpOnly: true,
    sameSite: "lax",
    secure: env.nodeEnv === "production",
    path: "/",
    maxAge: SESSION_TTL_MS,
  });
}

export function clearSessionCookie(res) {
  res.clearCookie(SESSION_COOKIE_NAME, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.nodeEnv === "production",
    path: "/",
  });
}
