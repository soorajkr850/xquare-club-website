import { google } from "googleapis";
import type { Readable } from "stream";
import { Readable as NodeReadable } from "stream";

function nowIST(): string {
  return new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    hour12: false,
  });
}

const SHEET_ID    = "1AVFWMdj7QrsKdIb7yYev62gniGiLBFloknD55V_EoSw";
const SHEET_TAB   = "Submissions";
const FOLDER_NAME = "XQUARE CLUB — Influencer Uploads";

let BUSINESS_SHEET_ID: string | null = "1BGCOC4T8ymbiN_HGuM7AOjaXGkE8yyxYKxoRpWvkzYE";
const BUSINESS_SHEET_NAME = "XQUARE CLUB — Business Listings";
const BUSINESS_SHEET_TAB  = "Listings";
const BUSINESS_HEADERS = [
  "Submitted At",
  "Business / Brand Name", "Contact Person Name", "Mobile Number", "Email Address",
  "Business Address", "City", "State", "PIN Code",
  "Nature of Business", "Nature of Business (Other)", "MSME Registered",
  "Business Registration ID", "GST Registration Number", "Verification Document",
  "Products Sold", "Product Categories", "Product Category (Other)", "Avg Price Range",
  "Competitor Pricing", "Price Difference from Competitors",
  "Avg Margin per Product (₹)", "Avg Monthly Sales (₹)",
  "Sales Channels", "Online Channels", "Online Channels (Other)",
  "Offline Channels", "Offline Channels (Other)",
  "Uses ERP/CRM", "ERP/CRM Name", "Interested in ERP/CRM",
  "Interested in Influencer Marketing", "Additional Details",
];

const HEADERS = [
  "Submitted At", "Consent", "Platform", "Handle", "Profile Link",
  "Follower Range", "Niches", "Niche Other", "Earn Methods", "Earn Other",
  "Collab Frequency", "Collab Source", "Collab Source Other", "Pricing Method",
  "Pricing Other", "Price Range", "Full Name", "Mobile", "Email", "City", "State",
  "KYC Type", "KYC Number", "Dashboard Screenshot", "Profile Photo", "KYC Doc",
];

let uploadFolderId: string | null = null;
let folderCreationPromise: Promise<string> | null = null;

function getClients() {
  const keyJson = process.env["GOOGLE_SERVICE_ACCOUNT_JSON"];
  if (!keyJson) throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON env var not set");
  const credentials = JSON.parse(keyJson);
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: [
      "https://www.googleapis.com/auth/spreadsheets",
      "https://www.googleapis.com/auth/drive",
    ],
  });
  return {
    sheets: google.sheets({ version: "v4", auth }),
    drive:  google.drive({ version: "v3", auth }),
  };
}

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
    return uploadFolderId;
  })();
  return folderCreationPromise;
}

export async function uploadFileToDrive(
  buffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<string> {
  const { drive } = getClients();
  const folderId  = await ensureUploadFolder(drive);
  const stream    = NodeReadable.from(buffer) as unknown as Readable;
  const res = await drive.files.create({
    requestBody: { name: fileName, parents: [folderId] },
    media: { mimeType, body: stream },
    fields: "id, webViewLink",
  });
  const fileId = res.data.id!;
  await drive.permissions.create({
    fileId,
    requestBody: { role: "reader", type: "anyone" },
  });
  return res.data.webViewLink ?? `https://drive.google.com/file/d/${fileId}/view`;
}

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

export async function appendToSheet(data: Record<string, unknown>): Promise<void> {
  const { sheets } = getClients();
  await ensureHeaders(sheets);
  const str = (v: unknown) => Array.isArray(v) ? v.join(", ") : String(v ?? "");
  const row = [
    nowIST(),
    data.consent ? "Yes" : "No",
    str(data.platform), str(data.handle), str(data.profileLink),
    str(data.followerRange), str(data.niches), str(data.nicheOther),
    str(data.earnMethods), str(data.earnOther), str(data.collabFreq),
    str(data.collabSource), str(data.collabSourceOther), str(data.pricingMethod),
    str(data.pricingOther), str(data.priceRange), str(data.fullName),
    str(data.mobile), str(data.email), str(data.city), str(data.state),
    str(data.kycType), str(data.kycNumber),
    str(data.dashboardScreenshotUrl ?? data.dashboardScreenshotName ?? ""),
    str(data.profilePhotoUrl ?? data.profilePhotoName ?? ""),
    str(data.kycDocUrl ?? data.kycDocName ?? ""),
  ];
  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_TAB}!A1`,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [row] },
  });
}

let businessHeadersWritten = false;
async function ensureBusinessSheet(
  sheets: ReturnType<typeof google.sheets>,
  drive: ReturnType<typeof google.drive>
): Promise<string> {
  if (BUSINESS_SHEET_ID) {
    if (!businessHeadersWritten) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: BUSINESS_SHEET_ID,
        range: `${BUSINESS_SHEET_TAB}!A1`,
        valueInputOption: "RAW",
        requestBody: { values: [BUSINESS_HEADERS] },
      });
      businessHeadersWritten = true;
    }
    return BUSINESS_SHEET_ID;
  }
  const search = await drive.files.list({
    q: `name='${BUSINESS_SHEET_NAME}' and mimeType='application/vnd.google-apps.spreadsheet' and trashed=false`,
    fields: "files(id,name)",
    spaces: "drive",
  });
  if (search.data.files && search.data.files.length > 0) {
    BUSINESS_SHEET_ID = search.data.files[0].id!;
    return BUSINESS_SHEET_ID;
  }
  const newSheet = await sheets.spreadsheets.create({
    requestBody: {
      properties: { title: BUSINESS_SHEET_NAME },
      sheets: [{ properties: { title: BUSINESS_SHEET_TAB } }],
    },
    fields: "spreadsheetId",
  });
  BUSINESS_SHEET_ID = newSheet.data.spreadsheetId!;
  await sheets.spreadsheets.values.update({
    spreadsheetId: BUSINESS_SHEET_ID,
    range: `${BUSINESS_SHEET_TAB}!A1`,
    valueInputOption: "RAW",
    requestBody: { values: [BUSINESS_HEADERS] },
  });
  return BUSINESS_SHEET_ID;
}

export async function appendBusinessListingToSheet(
  data: Record<string, string>
): Promise<void> {
  const { sheets, drive } = getClients();
  const sheetId = await ensureBusinessSheet(sheets, drive);
  const row = [
    nowIST(),
    data.businessName || "", data.contactName || "", data.mobile || "",
    data.email || "", data.address || "", data.city || "", data.state || "",
    data.pinCode || "", data.natureOfBusiness || "", data.natureOther || "",
    data.msmeRegistered || "", data.businessRegId || "", data.gstNumber || "",
    data.verificationDocUrl || "", data.products || "", data.productCategories || "",
    data.categoryOther || "", data.avgPriceRange || "", data.competitorPricing || "",
    data.priceDifference || "", data.avgMargin || "", data.avgMonthlySales || "",
    data.salesChannels || "", data.onlineChannels || "", data.onlineOther || "",
    data.offlineChannels || "", data.offlineOther || "", data.usesErpCrm || "",
    data.erpCrmName || "", data.interestedInErpCrm || "",
    data.interestedInInfluencers || "", data.additionalDetails || "",
  ];
  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: `${BUSINESS_SHEET_TAB}!A1`,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [row] },
  });
}
