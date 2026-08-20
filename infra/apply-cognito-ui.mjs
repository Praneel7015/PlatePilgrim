#!/usr/bin/env node
// Applies PlatePilgrim branding to Cognito Hosted UI / managed login.
// Usage: node apply-cognito-ui.mjs

import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const USER_POOL_ID = process.env.COGNITO_USER_POOL_ID || "ap-south-1_2RM8gM80U";
const CLIENT_ID = process.env.COGNITO_CLIENT_ID || "25klgjete6qfkek6uko5t05k7g";
const DOMAIN = process.env.COGNITO_DOMAIN_PREFIX || "platepilgrim";

const cssPath = path.join(__dirname, "assets/cognito-hosted-ui.css");
const logoPath = path.join(__dirname, "assets/cognito-logo.png");
const settingsPath = path.join(__dirname, "assets/cognito-managed-login.json");

function aws(args) {
  const result = spawnSync("aws", args, { encoding: "utf8", shell: false });
  if (result.status !== 0) {
    const err = (result.stderr || result.stdout || "").trim();
    throw new Error(err || `aws ${args[0]} failed`);
  }
  return result.stdout;
}

const css = fs.readFileSync(cssPath, "utf8");
console.log("Applying classic Hosted UI CSS + logo…");
aws([
  "cognito-idp", "set-ui-customization",
  "--user-pool-id", USER_POOL_ID,
  "--client-id", "ALL",
  "--css", css,
  "--image-file", `fileb://${logoPath}`,
]);
console.log("Classic Hosted UI branding applied.");

try {
  console.log("Switching domain to managed login v2…");
  aws([
    "cognito-idp", "update-user-pool-domain",
    "--user-pool-id", USER_POOL_ID,
    "--domain", DOMAIN,
    "--managed-login-version", "2",
  ]);
  console.log("Domain now uses managed login.");
} catch (err) {
  console.warn("Could not enable managed login (classic theme still applied):", err.message);
  process.exit(0);
}

const settings = fs.readFileSync(settingsPath, "utf8");
const logoB64 = fs.readFileSync(logoPath).toString("base64");

try {
  aws([
    "cognito-idp", "create-managed-login-branding",
    "--user-pool-id", USER_POOL_ID,
    "--client-id", CLIENT_ID,
    "--settings", settings,
    "--assets", JSON.stringify([
      {
        Category: "FORM_LOGO",
        ColorMode: "LIGHT",
        Extension: "PNG",
        Bytes: logoB64,
      },
    ]),
  ]);
  console.log("Managed login branding created.");
} catch (err) {
  if (/already exists|Conflict/i.test(err.message)) {
    console.log("Branding already exists — updating…");
    const described = JSON.parse(aws([
      "cognito-idp", "describe-managed-login-branding-by-client",
      "--user-pool-id", USER_POOL_ID,
      "--client-id", CLIENT_ID,
    ]));
    const brandingId = described.ManagedLoginBranding?.ManagedLoginBrandingId;
    if (!brandingId) throw new Error("No ManagedLoginBrandingId to update");
    aws([
      "cognito-idp", "update-managed-login-branding",
      "--user-pool-id", USER_POOL_ID,
      "--managed-login-branding-id", brandingId,
      "--settings", settings,
      "--assets", JSON.stringify([
        {
          Category: "FORM_LOGO",
          ColorMode: "LIGHT",
          Extension: "PNG",
          Bytes: logoB64,
        },
      ]),
    ]);
    console.log("Managed login branding updated.");
  } else {
    console.warn("Managed login branding failed (classic theme still applied):", err.message);
  }
}
