import { Router } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { appendToSheet, uploadFileToDrive } from "../lib/googleSheets.js";

const router = Router();

/* ── multer: store all uploads in memory ── */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB per file
});

/* ── local backup storage ── */
const DATA_FILE = path.join(process.cwd(), "onboarding-submissions.json");

function readSubmissions(): unknown[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    }
  } catch { /* ignore */ }
  return [];
}

function saveSubmission(data: unknown): void {
  const list = readSubmissions();
  list.push({ ...(data as object), _submittedAt: new Date().toISOString() });
  fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2));
}

/* POST /api/onboarding  (multipart/form-data) */
router.post(
  "/onboarding",
  upload.fields([
    { name: "dashboardScreenshot", maxCount: 1 },
    { name: "profilePhoto",        maxCount: 1 },
    { name: "kycDoc",              maxCount: 1 },
  ]),
  async (req, res) => {
    /* ── parse text fields (sent as individual form fields or as JSON blob) ── */
    let fields: Record<string, unknown> = {};
    if (req.body?.data) {
      try { fields = JSON.parse(req.body.data as string); } catch { fields = req.body; }
    } else {
      fields = req.body ?? {};
    }

    /* arrays might be sent as comma-separated strings */
    const parseArr = (v: unknown): string[] => {
      if (Array.isArray(v)) return v as string[];
      if (typeof v === "string" && v) return v.split(",").map(s => s.trim()).filter(Boolean);
      return [];
    };

    const payload: Record<string, unknown> = {
      consent:           fields.consent === "true" || fields.consent === true,
      platform:          fields.platform ?? "",
      handle:            fields.handle ?? "",
      profileLink:       fields.profileLink ?? "",
      followerRange:     fields.followerRange ?? "",
      niches:            parseArr(fields.niches),
      nicheOther:        fields.nicheOther ?? "",
      earnMethods:       parseArr(fields.earnMethods),
      earnOther:         fields.earnOther ?? "",
      collabFreq:        fields.collabFreq ?? "",
      collabSource:      parseArr(fields.collabSource),
      collabSourceOther: fields.collabSourceOther ?? "",
      pricingMethod:     parseArr(fields.pricingMethod),
      pricingOther:      fields.pricingOther ?? "",
      priceRange:        fields.priceRange ?? "",
      fullName:          fields.fullName ?? "",
      mobile:            fields.mobile ?? "",
      email:             fields.email ?? "",
      city:              fields.city ?? "",
      state:             fields.state ?? "",
      kycType:           fields.kycType ?? "",
      kycNumber:         fields.kycNumber ?? "",
    };

    /* ── upload files to Google Drive ── */
    const files = req.files as Record<string, Express.Multer.File[]> | undefined;

    const uploadOne = async (fieldName: string): Promise<string | null> => {
      const fileArr = files?.[fieldName];
      if (!fileArr || fileArr.length === 0) return null;
      const f = fileArr[0];
      try {
        const url = await uploadFileToDrive(f.buffer, f.originalname, f.mimetype);
        console.log(`[onboarding] Uploaded ${fieldName}: ${url}`);
        return url;
      } catch (err) {
        console.error(`[onboarding] Drive upload failed for ${fieldName}:`, err);
        return null;
      }
    };

    const [dashboardScreenshotUrl, profilePhotoUrl, kycDocUrl] = await Promise.all([
      uploadOne("dashboardScreenshot"),
      uploadOne("profilePhoto"),
      uploadOne("kycDoc"),
    ]);

    payload.dashboardScreenshotUrl = dashboardScreenshotUrl;
    payload.profilePhotoUrl        = profilePhotoUrl;
    payload.kycDocUrl              = kycDocUrl;

    /* ── save locally ── */
    try { saveSubmission(payload); } catch (err) {
      console.error("[onboarding] Local save failed:", err);
    }

    /* ── write to Google Sheets (fire & await so errors are visible) ── */
    try {
      await appendToSheet(payload);
      console.log("[onboarding] Written to Google Sheets successfully");
    } catch (err) {
      console.error("[onboarding] Google Sheets write failed:", err);
    }

    res.json({ success: true, message: "Submission received" });
  }
);

/* GET /api/onboarding */
router.get("/onboarding", (_req, res) => {
  res.json(readSubmissions());
});

export default router;
