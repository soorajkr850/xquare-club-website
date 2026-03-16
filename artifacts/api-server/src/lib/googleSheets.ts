/**
 * Google Sheets integration — uses Replit Google Sheets connector (OAuth).
 * Connection: conn_google-sheet_01KKV9Z25HMP2K0564F7XQGT0T
 *
 * Spreadsheet: XQUARE CLUB — Influencer Onboarding Submissions
 * URL: https://docs.google.com/spreadsheets/d/1AVFWMdj7QrsKdIb7yYev62gniGiLBFloknD55V_EoSw/edit
 */
import { google } from "googleapis";

const SHEET_ID = "1AVFWMdj7QrsKdIb7yYev62gniGiLBFloknD55V_EoSw";
const SHEET_TAB = "Submissions";

const HEADERS = [
  "Submitted At",
  "Consent",
  "Platform",
  "Handle",
  "Profile Link",
  "Follower Range",
  "Niches",
  "Niche Other",
  "Earn Methods",
  "Earn Other",
  "Collab Frequency",
  "Collab Source",
  "Collab Source Other",
  "Pricing Method",
  "Pricing Other",
  "Price Range",
  "Full Name",
  "Mobile",
  "Email",
  "City",
  "State",
  "KYC Type",
  "KYC Number",
  "Dashboard Screenshot",
  "Profile Photo",
  "KYC Doc",
];

/* ── Replit OAuth token refresh ── */
let connectionSettings: {
  settings: {
    expires_at?: string;
    access_token?: string;
    oauth?: { credentials?: { access_token?: string } };
  };
} | null = null;

async function getAccessToken(): Promise<string> {
  if (
    connectionSettings?.settings?.expires_at &&
    new Date(connectionSettings.settings.expires_at).getTime() > Date.now()
  ) {
    return connectionSettings.settings.access_token!;
  }

  const hostname = process.env["REPLIT_CONNECTORS_HOSTNAME"];
  const replIdentity = process.env["REPL_IDENTITY"];
  const webReplRenewal = process.env["WEB_REPL_RENEWAL"];

  const xReplitToken = replIdentity
    ? "repl " + replIdentity
    : webReplRenewal
    ? "depl " + webReplRenewal
    : null;

  if (!hostname || !xReplitToken) {
    throw new Error("Replit connector env vars not set (REPLIT_CONNECTORS_HOSTNAME / REPL_IDENTITY)");
  }

  const response = await fetch(
    `https://${hostname}/api/v2/connection?include_secrets=true&connector_names=google-sheet`,
    {
      headers: {
        Accept: "application/json",
        "X-Replit-Token": xReplitToken,
      },
    }
  );

  const data = (await response.json()) as { items?: typeof connectionSettings[] };
  connectionSettings = data.items?.[0] ?? null;

  const accessToken =
    connectionSettings?.settings?.access_token ||
    connectionSettings?.settings?.oauth?.credentials?.access_token;

  if (!accessToken) {
    throw new Error("Google Sheet not connected — no access token returned");
  }

  return accessToken;
}

async function getUncachableGoogleSheetClient() {
  const accessToken = await getAccessToken();
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });
  return google.sheets({ version: "v4", auth: oauth2Client });
}

async function ensureHeaders(
  sheetsClient: ReturnType<typeof google.sheets>
): Promise<void> {
  const res = await sheetsClient.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_TAB}!A1:Z1`,
  });
  const existing = res.data.values?.[0] ?? [];
  if (existing.length === 0) {
    await sheetsClient.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_TAB}!A1`,
      valueInputOption: "RAW",
      requestBody: { values: [HEADERS] },
    });
  }
}

export async function appendToSheet(data: Record<string, unknown>): Promise<void> {
  const sheetsClient = await getUncachableGoogleSheetClient();
  await ensureHeaders(sheetsClient);

  const str = (v: unknown) =>
    Array.isArray(v) ? v.join(", ") : String(v ?? "");

  const row = [
    new Date().toISOString(),
    data.consent ? "Yes" : "No",
    str(data.platform),
    str(data.handle),
    str(data.profileLink),
    str(data.followerRange),
    str(data.niches),
    str(data.nicheOther),
    str(data.earnMethods),
    str(data.earnOther),
    str(data.collabFreq),
    str(data.collabSource),
    str(data.collabSourceOther),
    str(data.pricingMethod),
    str(data.pricingOther),
    str(data.priceRange),
    str(data.fullName),
    str(data.mobile),
    str(data.email),
    str(data.city),
    str(data.state),
    str(data.kycType),
    str(data.kycNumber),
    str(data.dashboardScreenshotName),
    str(data.profilePhotoName),
    str(data.kycDocName),
  ];

  await sheetsClient.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_TAB}!A1`,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [row] },
  });
}
