import dotenv from "dotenv";

dotenv.config();

const DEFAULT_SUPABASE_URL = "https://pmcnznvekkjbcfrsicme.supabase.co";
const DEFAULT_ALLOWED_ORIGINS = ["http://localhost:8080", "http://127.0.0.1:8080"];

function readRequiredEnv(name, fallback = "") {
  const value = process.env[name] ?? fallback;

  if (!value) {
    throw new Error(`Variavel de ambiente obrigatoria ausente: ${name}`);
  }

  return value;
}

const appOrigin = process.env.APP_ORIGIN || DEFAULT_ALLOWED_ORIGINS[0];
const allowedOrigins = Array.from(
  new Set(
    [
      ...DEFAULT_ALLOWED_ORIGINS,
      appOrigin,
      ...(process.env.ALLOWED_ORIGINS || "")
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean),
    ],
  ),
);

const adminPassword = process.env.ADMIN_PASSWORD || "";
const dashboardPassword = process.env.DASHBOARD_PASSWORD || "";

if (!adminPassword && !dashboardPassword) {
  throw new Error("Defina ADMIN_PASSWORD e/ou DASHBOARD_PASSWORD no ambiente.");
}

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 3001),
  appOrigin,
  allowedOrigins,
  supabaseUrl: readRequiredEnv("SUPABASE_URL", DEFAULT_SUPABASE_URL),
  supabaseServiceRoleKey: readRequiredEnv("SUPABASE_SERVICE_ROLE_KEY"),
  sessionSecret: readRequiredEnv("SESSION_SECRET"),
  adminPassword,
  dashboardPassword,
};
