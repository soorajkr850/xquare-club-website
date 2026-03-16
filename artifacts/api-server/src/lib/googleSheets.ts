import { google } from "googleapis";

const SHEET_ID = process.env["GOOGLE_SHEET_ID"] ?? "";

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

function getClient() {
  const raw = process.env["GOOGLE_SERVICE_ACCOUNT_JSON"] ?? "";
  if (!raw) throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON env var not set");
  const credentials = JSON.parse(raw);
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return google.sheets({ version: "v4", auth });
}

async function ensureHeaders(sheetsClient: ReturnType<typeof google.sheets>) {
  const res = await sheetsClient.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: "Sheet1!A1:Z1",
  });
  const existing = res.data.values?.[0] ?? [];
  if (existing.length === 0) {
    await sheetsClient.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: "Sheet1!A1",
      valueInputOption: "RAW",
      requestBody: { values: [HEADERS] },
    });
  }
}

export async function appendToSheet(data: Record<string, unknown>): Promise<void> {
  if (!SHEET_ID) throw new Error("GOOGLE_SHEET_ID not configured");
  const sheetsClient = getClient();
  await ensureHeaders(sheetsClient);

  const arr = (v: unknown) =>
    Array.isArray(v) ? v.join(", ") : String(v ?? "");

  const row = [
    new Date().toISOString(),
    data.consent ? "Yes" : "No",
    arr(data.platform),
    arr(data.handle),
    arr(data.profileLink),
    arr(data.followerRange),
    arr(data.niches),
    arr(data.nicheOther),
    arr(data.earnMethods),
    arr(data.earnOther),
    arr(data.collabFreq),
    arr(data.collabSource),
    arr(data.collabSourceOther),
    arr(data.pricingMethod),
    arr(data.pricingOther),
    arr(data.priceRange),
    arr(data.fullName),
    arr(data.mobile),
    arr(data.email),
    arr(data.city),
    arr(data.state),
    arr(data.kycType),
    arr(data.kycNumber),
    arr(data.dashboardScreenshotName),
    arr(data.profilePhotoName),
    arr(data.kycDocName),
  ];

  await sheetsClient.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: "Sheet1!A1",
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [row] },
  });
}
