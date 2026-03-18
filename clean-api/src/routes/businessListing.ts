import { Router } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { appendBusinessListingToSheet, uploadFileToDrive } from "../lib/googleSheets.js";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
});

const DATA_FILE = path.join(process.cwd(), "business-listings.json");

function readListings(): unknown[] {
  try {
    if (fs.existsSync(DATA_FILE)) return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  } catch { /* ignore */ }
  return [];
}

function saveListing(data: unknown): void {
  const list = readListings();
  const nowIST = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", hour12: false });
  list.push({ ...(data as object), _submittedAt: nowIST });
  fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2));
}

/* POST /api/business-listing */
router.post(
  "/business-listing",
  upload.single("verificationDoc"),
  async (req, res) => {
    const b = req.body as Record<string, string>;

    const data = {
      businessName:             b.businessName             || "",
      contactName:              b.contactName              || "",
      mobile:                   b.mobile                   || "",
      email:                    b.email                    || "",
      address:                  b.address                  || "",
      city:                     b.city                     || "",
      state:                    b.state                    || "",
      pinCode:                  b.pinCode                  || "",
      natureOfBusiness:         b.natureOfBusiness         || "",
      natureOther:              b.natureOther              || "",
      msmeRegistered:           b.msmeRegistered           || "",
      businessRegId:            b.businessRegId            || "",
      gstNumber:                b.gstNumber                || "",
      products:                 b.products                 || "",
      productCategories:        b.productCategories        || "",
      categoryOther:            b.categoryOther            || "",
      avgPriceRange:            b.avgPriceRange            || "",
      competitorPricing:        b.competitorPricing        || "",
      priceDifference:          b.priceDifference          || "",
      avgMargin:                b.avgMargin                || "",
      avgMonthlySales:          b.avgMonthlySales          || "",
      salesChannels:            b.salesChannels            || "",
      onlineChannels:           b.onlineChannels           || "",
      onlineOther:              b.onlineOther              || "",
      offlineChannels:          b.offlineChannels          || "",
      offlineOther:             b.offlineOther             || "",
      usesErpCrm:               b.usesErpCrm               || "",
      erpCrmName:               b.erpCrmName               || "",
      interestedInErpCrm:       b.interestedInErpCrm       || "",
      interestedInInfluencers:  b.interestedInInfluencers  || "",
      additionalDetails:        b.additionalDetails        || "",
    };

    try { saveListing(data); } catch (ex) {
      console.error("[business-listing] Local save failed:", ex);
    }

    /* upload verification doc to Drive if provided */
    let verificationDocUrl = "";
    if (req.file) {
      try {
        verificationDocUrl = await uploadFileToDrive(
          req.file.buffer,
          req.file.originalname,
          req.file.mimetype
        );
        console.log(`[business-listing] Uploaded verificationDoc: ${verificationDocUrl}`);
      } catch (ex) {
        console.error("[business-listing] Drive upload failed:", ex);
      }
    }

    try {
      await appendBusinessListingToSheet({ ...data, verificationDocUrl });
      console.log("[business-listing] Written to Google Sheets successfully");
    } catch (ex) {
      console.error("[business-listing] Google Sheets write failed:", ex);
    }

    res.json({ success: true, message: "Business listing received" });
  }
);

/* GET /api/business-listing */
router.get("/business-listing", (_req, res) => {
  res.json(readListings());
});

export default router;
