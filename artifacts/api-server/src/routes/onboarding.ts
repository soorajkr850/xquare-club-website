import { Router } from "express";
import fs from "fs";
import path from "path";

const router = Router();

/* ── storage ── */
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
  list.push({ ...( data as object ), _submittedAt: new Date().toISOString() });
  fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2));
}

/*
 * ── Google Form entry IDs ──
 * Replace these placeholder IDs with the real ones from your Google Form.
 * To find them:
 *  1. Open your Google Form editor
 *  2. Click ⋮ → "Get pre-filled link"
 *  3. Fill in dummy values for every field → click "Get Link"
 *  4. The resulting URL contains ?entry.XXXXXXXXX=dummy — copy those IDs here
 */
const GOOGLE_FORM_ID = "1FAIpQLSc9u__sFa4_CHEjIP3K093UL1VklLojNauvLEiCLREvKWCBcQ";
const FORM_ACTION    = `https://docs.google.com/forms/d/e/${GOOGLE_FORM_ID}/formResponse`;

const ENTRY = {
  consent:      "entry.CONSENT",
  platform:     "entry.PLATFORM",
  handle:       "entry.HANDLE",
  profileLink:  "entry.PROFILELINK",
  followerRange:"entry.FOLLOWERRANGE",
  niches:       "entry.NICHES",
  earnMethods:  "entry.EARNMETHODS",
  collabFreq:   "entry.COLLABFREQ",
  collabSource: "entry.COLLABSOURCE",
  pricingMethod:"entry.PRICINGMETHOD",
  priceRange:   "entry.PRICERANGE",
  fullName:     "entry.FULLNAME",
  mobile:       "entry.MOBILE",
  email:        "entry.EMAIL",
  city:         "entry.CITY",
  state:        "entry.STATE",
  kycType:      "entry.KYCTYPE",
  kycNumber:    "entry.KYCNUMBER",
};

async function postToGoogleForms(body: Record<string, unknown>): Promise<boolean> {
  try {
    const params = new URLSearchParams();
    const add = (k: string, v: unknown) => {
      if (Array.isArray(v)) v.forEach(item => params.append(k, String(item)));
      else if (v !== undefined && v !== null && v !== "") params.append(k, String(v));
    };

    add(ENTRY.consent,      body.consent ? "I agree" : "");
    add(ENTRY.platform,     body.platform);
    add(ENTRY.handle,       body.handle);
    add(ENTRY.profileLink,  body.profileLink);
    add(ENTRY.followerRange,body.followerRange);
    add(ENTRY.niches,       body.niches);
    add(ENTRY.earnMethods,  body.earnMethods);
    add(ENTRY.collabFreq,   body.collabFreq);
    add(ENTRY.collabSource, body.collabSource);
    add(ENTRY.pricingMethod,body.pricingMethod);
    add(ENTRY.priceRange,   body.priceRange);
    add(ENTRY.fullName,     body.fullName);
    add(ENTRY.mobile,       body.mobile);
    add(ENTRY.email,        body.email);
    add(ENTRY.city,         body.city);
    add(ENTRY.state,        body.state);
    add(ENTRY.kycType,      body.kycType);
    add(ENTRY.kycNumber,    body.kycNumber);

    const res = await fetch(FORM_ACTION, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
      redirect: "follow",
    });
    return res.ok || res.status === 0;
  } catch {
    return false;
  }
}

/* POST /api/onboarding */
router.post("/onboarding", async (req, res) => {
  const body = req.body as Record<string, unknown>;

  if (!body || typeof body !== "object") {
    res.status(400).json({ success: false, error: "Invalid request body" });
    return;
  }

  /* always save locally first */
  try {
    saveSubmission(body);
  } catch (err) {
    console.error("Failed to save submission:", err);
  }

  /* best-effort forward to Google Forms (fire and forget) */
  postToGoogleForms(body).then(ok => {
    if (ok) console.log("[onboarding] Google Forms submission successful");
    else    console.warn("[onboarding] Google Forms submission failed or pending entry IDs");
  }).catch(() => {});

  res.json({ success: true, message: "Submission received" });
});

/* GET /api/onboarding (admin: list submissions) */
router.get("/onboarding", (_req, res) => {
  res.json(readSubmissions());
});

export default router;
