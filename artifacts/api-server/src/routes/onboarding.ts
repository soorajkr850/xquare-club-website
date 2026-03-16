import { Router } from "express";
import fs from "fs";
import path from "path";
import { appendToSheet } from "../lib/googleSheets.js";

const router = Router();

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

/* POST /api/onboarding */
router.post("/onboarding", async (req, res) => {
  const body = req.body as Record<string, unknown>;

  if (!body || typeof body !== "object") {
    res.status(400).json({ success: false, error: "Invalid request body" });
    return;
  }

  /* save locally first as backup */
  try {
    saveSubmission(body);
  } catch (err) {
    console.error("[onboarding] Local save failed:", err);
  }

  /* write to Google Sheets via Replit OAuth connector (fire and forget) */
  appendToSheet(body)
    .then(() => console.log("[onboarding] Written to Google Sheets successfully"))
    .catch(err => console.error("[onboarding] Google Sheets write failed:", err));

  res.json({ success: true, message: "Submission received" });
});

/* GET /api/onboarding (list all local submissions) */
router.get("/onboarding", (_req, res) => {
  res.json(readSubmissions());
});

export default router;
