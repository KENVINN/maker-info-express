import dotenv from "dotenv";

dotenv.config();

const required = [
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "SESSION_SECRET",
  "ADMIN_PASSWORD",
  "DASHBOARD_PASSWORD",
  "APP_ORIGIN",
];

const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(`Variaveis obrigatorias ausentes: ${missing.join(", ")}`);
  process.exit(1);
}

const origins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const summary = {
  supabaseUrl: process.env.SUPABASE_URL,
  appOrigin: process.env.APP_ORIGIN,
  allowedOrigins: origins,
  port: Number(process.env.PORT || 3001),
  hasSessionSecret: Boolean(process.env.SESSION_SECRET),
  hasAdminPassword: Boolean(process.env.ADMIN_PASSWORD),
  hasDashboardPassword: Boolean(process.env.DASHBOARD_PASSWORD),
};

console.log(JSON.stringify(summary, null, 2));
