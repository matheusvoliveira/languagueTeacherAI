const fs = require("fs");
const path = require("path");

function getEnv(name, fallback = "") {
  return process.env[name] || fallback;
}

function getRequiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function parseCsv(value, fallback = []) {
  if (!value) {
    return fallback;
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function loadFirebaseServiceAccount() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  }

  const serviceAccountPath = getEnv("FIREBASE_SERVICE_ACCOUNT_PATH");
  if (serviceAccountPath) {
    const resolvedPath = path.resolve(serviceAccountPath);
    return JSON.parse(fs.readFileSync(resolvedPath, "utf8"));
  }

  throw new Error(
    "Missing Firebase Admin credentials. Set FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_SERVICE_ACCOUNT_PATH."
  );
}

function getDatabaseConfig() {
  return {
    dialect: getEnv("DB_DIALECT", "postgres"),
    host: getEnv("DB_HOST", "localhost"),
    port: Number(getEnv("DB_PORT", "5432")),
    database: getRequiredEnv("DB_NAME"),
    username: getRequiredEnv("DB_USER"),
    password: getRequiredEnv("DB_PASSWORD"),
    logging: false,
  };
}

module.exports = {
  allowedOrigins: parseCsv(getEnv("ALLOWED_ORIGINS"), ["http://localhost:3000"]),
  clientAppUrl: getEnv("CLIENT_APP_URL", "http://localhost:3000"),
  firebaseDatabaseUrl: getRequiredEnv("FIREBASE_DATABASE_URL"),
  firebaseServiceAccount: loadFirebaseServiceAccount(),
  getDatabaseConfig,
  port: Number(getEnv("PORT", "8800")),
  stripeMonthlyPriceId: getRequiredEnv("STRIPE_MONTHLY_PRICE_ID"),
  stripeQuarterlyPriceId: getRequiredEnv("STRIPE_QUARTERLY_PRICE_ID"),
};
