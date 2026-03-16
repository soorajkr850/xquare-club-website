/**
 * Google Sheets + Google Drive integration — Replit OAuth connector.
 * Connection: conn_google-sheet_01KKV9Z25HMP2K0564F7XQGT0T
 *
 * Spreadsheet: XQUARE CLUB — Influencer Onboarding Submissions
 * URL: https://docs.google.com/spreadsheets/d/1AVFWMdj7QrsKdIb7yYev62gniGiLBFloknD55V_EoSw/edit
 */
import { google } from "googleapis";
import type { Readable } from "stream";
import { Readable as NodeReadable } from "stream";

const SHEET_ID   = "1AVFWMdj7QrsKdIb7yYev62gniGiLBFloknD55V_EoSw";
const SHEET_TAB  = "Submissions";
const FOLDER_NAME = "XQUARE CLUB — Influencer Uploads";

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

/* ── cached folder ID ── */
let uploadFolderId: string | null = null;
let folderCreationPromise: Promise<string> | null = null;

/* ── Replit OAuth token refresh ── */
let cachedToken: { accessToken: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.accessToken;
  }

  const hostname     = process.env["REPLIT_CONNECTORS_HOSTNAME"];
  const replIdentity = process.env["REPL_IDENTITY"];
  const webReplRenewal = process.env["WEB_REPL_RENEWAL"];
  const xReplitToken = replIdentity
    ? "repl " + replIdentity
    : webReplRenewal
    ? "depl " + webReplRenewal
    : null;

  if (!hostname || !xReplitToken) {
    throw new Error("Replit connector env vars not set");
  }

  const response = await fetch(
    `https://${hostname}/api/v2/connection?include_secrets=true&connector_names=google-sheet`,
    { headers: { Accept: "application/json", "X-Replit-Token": xReplitToken } }
  );

  const data = (await response.json()) as {
    items?: { settings: { access_token?: string; expires_at?: string; oauth?: { credentials?: { access_token?: string } } } }[];
  };

  const settings = data.items?.[0]?.settings;
  const accessToken =
    settings?.access_token ||
    settings?.oauth?.credentials?.access_token;

  if (!accessToken) throw new Error("Google Sheet not connected — no access token");

  cachedToken = {
    accessToken,
    expiresAt: settings?.expires_at ? new Date(settings.expires_at).getTime() : Date.now() + 3_000_000,
  };

  return accessToken;
}

async function getClients() {
  const accessToken = await getAccessToken();
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });
  return {
    sheets: google.sheets({ version: "v4", auth }),
    drive:  google.drive({ version: "v3",  auth }),
  };
}

/* ── ensure upload folder exists (create once, cache ID, no race conditions) ── */
async function ensureUploadFolder(drive: ReturnType<typeof google.drive>): Promise<string> {
  if (uploadFolderId) return uploadFolderId;
  if (folderCreationPromise) return folderCreationPromise;

  folderCreationPromise = (async () => {
    const search = await drive.files.list({
      q: `name='${FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      fields: "files(id)",
      spaces: "drive",
    });

    if (search.data.files && search.data.files.length > 0) {
      uploadFolderId = search.data.files[0].id!;
      return uploadFolderId;
    }

    const folder = await drive.files.create({
      requestBody: { name: FOLDER_NAME, mimeType: "application/vnd.google-apps.folder" },
      fields: "id",
    });

    uploadFolderId = folder.data.id!;
    console.log(`[drive] Created upload folder: ${FOLDER_NAME} (${uploadFolderId})`);
    return uploadFolderId;
  })();

  return folderCreationPromise;
}

/* ── upload a single file to Drive, return shareable link ── */
export async function uploadFileToDrive(
  buffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<string> {
  const { drive } = await getClients();
  const folderId  = await ensureUploadFolder(drive);

  const stream = NodeReadable.from(buffer) as unknown as Readable;

  const res = await drive.files.create({
    requestBody: {
      name:    fileName,
      parents: [folderId],
    },
    media: {
      mimeType,
      body: stream,
    },
    fields: "id, webViewLink",
  });

  const fileId = res.data.id!;

  /* make the file viewable by anyone with the link */
  await drive.permissions.create({
    fileId,
    requestBody: { role: "reader", type: "anyone" },
  });

  const link = res.data.webViewLink ?? `https://drive.google.com/file/d/${fileId}/view`;
  console.log(`[drive] Uploaded: ${fileName} → ${link}`);
  return link;
}

/* ── ensure spreadsheet headers ── */
async function ensureHeaders(sheets: ReturnType<typeof google.sheets>): Promise<void> {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_TAB}!A1:Z1`,
  });
  if ((res.data.values?.[0] ?? []).length === 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_TAB}!A1`,
      valueInputOption: "RAW",
      requestBody: { values: [HEADERS] },
    });
  }
}

/* ── append a submission row ── */
export async function appendToSheet(data: Record<string, unknown>): Promise<void> {
  const { sheets } = await getClients();
  await ensureHeaders(sheets);

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
    str(data.dashboardScreenshotUrl ?? data.dashboardScreenshotName ?? ""),
    str(data.profilePhotoUrl       ?? data.profilePhotoName        ?? ""),
    str(data.kycDocUrl             ?? data.kycDocName              ?? ""),
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_TAB}!A1`,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [row] },
  });
}
