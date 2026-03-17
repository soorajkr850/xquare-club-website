import { Router } from "express";
import fs from "fs";
import path from "path";
import { appendBusinessListingToSheet } from "../lib/googleSheets.js";

const router = Router();

const DATA_FILE = path.join(process.cwd(), "business-listings.json");

function readListings(): unknown[] {
  try {
    if (fs.existsSync(DATA_FILE)) return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  } catch { /* ignore */ }
  return [];
}

function saveListing(data: unknown): void {
  const list = readListings();
  list.push({ ...(data as object), _submittedAt: new Date().toISOString() });
  fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2));
}

/* POST /api/business-listing */
router.post("/business-listing", async (req, res) => {
  const { firstName, lastName, businessName } = req.body as Record<string, string>;

  if (!firstName || !lastName || !businessName) {
    res.status(400).json({ success: false, error: "All fields are required" });
    return;
  }

  try { saveListing({ firstName, lastName, businessName }); } catch (err) {
    console.error("[business-listing] Local save failed:", err);
  }

  try {
    await appendBusinessListingToSheet({ firstName, lastName, businessName });
    console.log("[business-listing] Written to Google Sheets successfully");
  } catch (err) {
    console.error("[business-listing] Google Sheets write failed:", err);
  }

  res.json({ success: true, message: "Business listing received" });
});

/* GET /api/business-listing */
router.get("/business-listing", (_req, res) => {
  res.json(readListings());
});

export default router;
