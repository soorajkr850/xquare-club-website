import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Upload, ChevronRight } from "lucide-react";

/* ── exact options from the Google Form screenshots ── */
const PLATFORMS = ["Instagram", "YouTube", "Facebook", "X (Twitter)", "Snapchat", "Other"];

const FOLLOWER_RANGES = [
  "50k–100k",
  "100k+"
];

const NICHES = [
  "Fashion / Beauty / Skincare",
  "Food / Restaurants / Recipes",
  "Travel",
  "Fitness / Sports",
  "Parenting / Kids",
  "Tech / Gadgets",
  "Education",
  "Lifestyle",
  "Finance / Business",
  "Local Shops / Small Businesses",
  "Entertainment",
  "Movie Reviews / Critics",
  "OTT / Series Reviews",
  "Trailer Reactions",
  "Cinema Analysis / Commentary",
  "Entertainment News / Pop Culture",
  "Photography",
  "Gaming",
  "Home Décor",
  "Health & Wellness",
  "Other"
];

const EARN_OPTIONS = [
  "Brand collaborations (paid promotions)",
  "Affiliate commissions (links/codes)",
  "Platform monetization (YouTube ads/bonuses, etc.)",
  "Selling own products/services",
  "UGC creation for brands (paid content without posting)",
  "Other"
];

const COLLAB_FREQ = [
  "Weekly or more",
  "2–3 times per month",
  "Monthly",
  "Once in 2–3 months",
  "Rarely",
  "Never so far"
];

const COLLAB_SOURCE = [
  "Brands contact me directly",
  "Agency / manager",
  "Influencer platforms",
  "I do outreach to brands",
  "Referrals / network",
  "Other"
];

const PRICING_METHOD = [
  "Fixed pricing (mostly the same rate)",
  "Depends on product/category (niche)",
  "Depends on deliverables (reel/story/post count)",
  "Depends on campaign duration",
  "Negotiable case-by-case",
  "I haven't done paid collaborations yet",
  "Other"
];

const PRICE_RANGES = [
  "Under ₹1,000",
  "₹1,000 – ₹3,000",
  "₹3,000 – ₹7,000",
  "₹7,000 – ₹15,000",
  "₹15,000 – ₹30,000",
  "₹30,000+",
  "Not applicable yet"
];

/* ── types ── */
type FormData = {
  consent: boolean;
  platform: string;
  handle: string;
  profileLink: string;
  dashboardScreenshot: File | null;
  followerRange: string;
  niches: string[];
  nicheOther: string;
  earnMethods: string[];
  earnOther: string;
  collabFreq: string;
  collabSource: string[];
  collabSourceOther: string;
  pricingMethod: string[];
  pricingOther: string;
  priceRange: string;
  fullName: string;
  mobile: string;
  email: string;
  city: string;
  state: string;
  profilePhoto: File | null;
  kycType: string;
  kycNumber: string;
  kycDoc: File | null;
};

const initial: FormData = {
  consent: false, platform: "", handle: "", profileLink: "",
  dashboardScreenshot: null, followerRange: "",
  niches: [], nicheOther: "",
  earnMethods: [], earnOther: "",
  collabFreq: "", collabSource: [], collabSourceOther: "",
  pricingMethod: [], pricingOther: "", priceRange: "",
  fullName: "", mobile: "", email: "", city: "", state: "",
  profilePhoto: null, kycType: "", kycNumber: "", kycDoc: null
};

/* ── shared style tokens ── */
const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors";
const labelClass = "block text-sm font-medium text-white/80 mb-2";
const errClass   = "text-red-400 text-xs mt-1.5";

/* ── sub-components ── */
function SectionCard({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 md:p-8 space-y-6"
    >
      <div className="border-b border-white/10 pb-4">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        {description && <p className="text-white/40 text-sm mt-1">{description}</p>}
      </div>
      {children}
    </motion.div>
  );
}

function CheckGroup({ options, selected, onChange, max }: {
  options: string[]; selected: string[]; onChange: (v: string[]) => void; max?: number;
}) {
  const toggle = (opt: string) => {
    if (selected.includes(opt)) onChange(selected.filter(s => s !== opt));
    else if (!max || selected.length < max) onChange([...selected, opt]);
  };
  return (
    <div className="grid sm:grid-cols-2 gap-2.5">
      {options.map(opt => (
        <button
          type="button"
          key={opt}
          onClick={() => toggle(opt)}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left cursor-pointer transition-all select-none w-full ${selected.includes(opt) ? "border-primary bg-primary/10 text-white" : "border-white/10 bg-white/[0.02] text-white/60 hover:border-white/25 hover:text-white/80"}`}
        >
          <div className={`w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${selected.includes(opt) ? "bg-primary border-primary" : "border-white/30"}`}>
            {selected.includes(opt) && <svg viewBox="0 0 10 8" className="w-2.5 h-2 text-white fill-none stroke-current"><path d="M1 4l3 3 5-6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          </div>
          <span className="text-sm leading-snug">{opt}</span>
        </button>
      ))}
    </div>
  );
}

function RadioGroup({ options, selected, onChange }: {
  options: string[]; selected: string; onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      {options.map(opt => (
        <button
          type="button"
          key={opt}
          onClick={() => onChange(opt)}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left cursor-pointer transition-all select-none w-full ${selected === opt ? "border-primary bg-primary/10 text-white" : "border-white/10 bg-white/[0.02] text-white/60 hover:border-white/25 hover:text-white/80"}`}
        >
          <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${selected === opt ? "border-primary" : "border-white/30"}`}>
            {selected === opt && <div className="w-2 h-2 rounded-full bg-primary" />}
          </div>
          <span className="text-sm">{opt}</span>
        </button>
      ))}
    </div>
  );
}

function FileInput({ label, value, onChange, accept, required, hint }: {
  label: string; value: File | null; onChange: (f: File | null) => void;
  accept?: string; required?: boolean; hint?: string;
}) {
  return (
    <div>
      <label className={labelClass}>
        {label}
        {required ? <span className="text-red-400 ml-1">*</span> : <span className="text-white/30 ml-1 font-normal">(Optional)</span>}
      </label>
      <label className="flex items-center gap-3 px-4 py-3.5 rounded-xl border border-dashed border-white/20 bg-white/[0.02] hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all group">
        <Upload className="w-4 h-4 text-white/40 group-hover:text-primary transition-colors flex-shrink-0" />
        <span className="text-sm text-white/40 group-hover:text-white/60 truncate">
          {value ? value.name : "Click to upload"}
        </span>
        <input type="file" accept={accept} className="hidden" onChange={e => onChange(e.target.files?.[0] || null)} />
      </label>
      {hint && <p className="text-white/25 text-xs mt-1">{hint}</p>}
    </div>
  );
}

/* ── main component ── */
export default function InfluencerOnboarding() {
  const [form, setForm] = useState<FormData>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = <K extends keyof FormData>(key: K, val: FormData[K]) =>
    setForm(f => ({ ...f, [key]: val }));

  const validate = () => {
    const e: typeof errors = {};
    if (!form.consent)            e.consent      = "You must agree to continue.";
    if (!form.platform)           e.platform     = "Select your primary platform.";
    if (!form.handle.trim())      e.handle       = "Handle is required.";
    if (!form.profileLink.trim()) e.profileLink  = "Profile link is required.";
    if (!form.dashboardScreenshot) e.dashboardScreenshot = "Please upload your dashboard screenshot.";
    if (!form.followerRange)      e.followerRange = "Select your follower range.";
    if (form.niches.length === 0) e.niches       = "Select at least one niche.";
    if (!form.collabFreq)         e.collabFreq   = "Select a frequency.";
    if (!form.priceRange)         e.priceRange   = "Select a price range.";
    if (!form.fullName.trim())    e.fullName     = "Full name is required.";
    if (!form.mobile.trim())      e.mobile       = "Mobile number is required.";
    if (!form.email.trim())       e.email        = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.city.trim())        e.city         = "City / District is required.";
    if (!form.state.trim())       e.state        = "State is required.";
    if (!form.profilePhoto)       e.profilePhoto = "Profile photo is required.";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      const firstErr = document.querySelector("[data-err]");
      firstErr?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setSubmitting(true);

    try {
      /* Build multipart/form-data so actual files get uploaded to the server */
      const fd = new FormData();

      /* text / choice fields */
      fd.append("consent",           String(form.consent));
      fd.append("platform",          form.platform);
      fd.append("handle",            form.handle);
      fd.append("profileLink",       form.profileLink);
      fd.append("followerRange",     form.followerRange);
      form.niches.forEach(v   => fd.append("niches",        v));
      fd.append("nicheOther",        form.nicheOther);
      form.earnMethods.forEach(v => fd.append("earnMethods", v));
      fd.append("earnOther",         form.earnOther);
      fd.append("collabFreq",        form.collabFreq);
      form.collabSource.forEach(v  => fd.append("collabSource",  v));
      fd.append("collabSourceOther", form.collabSourceOther);
      form.pricingMethod.forEach(v => fd.append("pricingMethod", v));
      fd.append("pricingOther",      form.pricingOther);
      fd.append("priceRange",        form.priceRange);
      fd.append("fullName",          form.fullName);
      fd.append("mobile",            form.mobile);
      fd.append("email",             form.email);
      fd.append("city",              form.city);
      fd.append("state",             form.state);
      fd.append("kycType",           form.kycType);
      fd.append("kycNumber",         form.kycNumber);

      /* actual files */
      if (form.dashboardScreenshot) fd.append("dashboardScreenshot", form.dashboardScreenshot);
      if (form.profilePhoto)        fd.append("profilePhoto",        form.profilePhoto);
      if (form.kycDoc)              fd.append("kycDoc",              form.kycDoc);

      const res = await fetch("https://xquare-club--techzitlearners.replit.app/api/onboarding", {
        method: "POST",
        body: fd, /* browser sets Content-Type with correct boundary automatically */
      });

      if (!res.ok) throw new Error(`Server error ${res.status}`);

    } catch (err) {
      console.error("Submission error:", err);
    }

    setSubmitting(false);
    setSubmitted(true);
  };

  /* ── success screen ── */
  if (submitted) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-4">You're on the list!</h1>
          <p className="text-white/60 mb-8">Thank you for submitting. Our team will review your details and connect with you on the next steps.</p>
          <button onClick={() => window.location.href = "/"} className="px-8 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-blue-400 transition-colors">
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  /* ── form ── */
  return (
    <div className="min-h-screen bg-black text-white">

      {/* top bar */}
      <div className="sticky top-0 z-40 border-b border-white/5 bg-black/80 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => window.location.href = "/"} className="text-white/50 hover:text-white text-sm transition-colors">← Back</button>
          <img src="/images/xquare-logo.png" alt="XQUARE CLUB" className="h-8 w-auto object-contain" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">

        {/* heading */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary border border-primary/30 bg-primary/10 rounded-full px-4 py-1.5 mb-4">Influencer Onboarding</span>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Apply as an Influencer</h1>
          <p className="text-white/50 text-sm max-w-xl mx-auto">Submit your application to join XQUARE CLUB as an influencer.</p>
          <p className="text-white/50 text-sm max-w-xl mx-auto mt-2">Your details will be used for review, verification, onboarding, and communication purposes.</p>
          <p className="text-red-400 text-xs mt-3">* Required Fields</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>

          {/* ── Section 1: Consent ── */}
          <SectionCard title="Consent">
            <button
              type="button"
              onClick={() => set("consent", !form.consent)}
              className={`flex items-start gap-4 p-4 rounded-xl border w-full text-left cursor-pointer transition-all select-none ${form.consent ? "border-primary bg-primary/10" : "border-white/10 hover:border-white/25"}`}
            >
              <div className={`w-5 h-5 mt-0.5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${form.consent ? "bg-primary border-primary" : "border-white/30"}`}>
                {form.consent && <svg viewBox="0 0 10 8" className="w-3 h-2.5 text-white fill-none stroke-current"><path d="M1 4l3 3 5-6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
              <span className="text-sm text-white/80 leading-relaxed">
                I am interested in Early Access and I agree that my submitted details may be used for onboarding and communication. <span className="text-red-400">*</span>
              </span>
            </button>
            {errors.consent && <p className={errClass} data-err>{errors.consent}</p>}
          </SectionCard>

          {/* ── Section 2: Social Media Profile Details ── */}
          <SectionCard title="Social Media Profile Details" description="Please provide your main social media profile details.">

            <div>
              <label className={labelClass}>Primary social platform <span className="text-red-400">*</span></label>
              <RadioGroup options={PLATFORMS} selected={form.platform} onChange={v => set("platform", v)} />
              {errors.platform && <p className={errClass} data-err>{errors.platform}</p>}
            </div>

            <div>
              <label className={labelClass}>Social media username / handle <span className="text-red-400">*</span></label>
              <input className={inputClass} placeholder="@yourhandle" value={form.handle} onChange={e => set("handle", e.target.value)} />
              {errors.handle && <p className={errClass} data-err>{errors.handle}</p>}
            </div>

            <div>
              <label className={labelClass}>Social profile link <span className="text-red-400">*</span></label>
              <input className={inputClass} type="url" placeholder="https://instagram.com/yourprofile" value={form.profileLink} onChange={e => set("profileLink", e.target.value)} />
              {errors.profileLink && <p className={errClass} data-err>{errors.profileLink}</p>}
            </div>

            <FileInput
              label="Social Media Dashboard Screenshot"
              value={form.dashboardScreenshot}
              onChange={f => set("dashboardScreenshot", f)}
              accept="image/*"
              required
              hint="Upload a screenshot showing your follower count or analytics."
            />
            {errors.dashboardScreenshot && <p className={errClass} data-err>{errors.dashboardScreenshot}</p>}

            <div>
              <label className={labelClass}>Follower Count Range <span className="text-red-400">*</span></label>
              <RadioGroup options={FOLLOWER_RANGES} selected={form.followerRange} onChange={v => set("followerRange", v)} />
              {errors.followerRange && <p className={errClass} data-err>{errors.followerRange}</p>}
            </div>
          </SectionCard>

          {/* ── Section 3: Niche ── */}
          <SectionCard title="Niche">
            <div>
              <label className={labelClass}>Which niche best describes your content? <span className="text-red-400">*</span></label>
              <p className="text-white/35 text-xs mb-3">Select up to 10</p>
              <CheckGroup options={NICHES} selected={form.niches} onChange={v => set("niches", v)} max={10} />
              {errors.niches && <p className={errClass} data-err>{errors.niches}</p>}
            </div>
            {form.niches.includes("Other") && (
              <div>
                <label className={labelClass}>If Other, please specify</label>
                <input className={inputClass} placeholder="Describe your niche..." value={form.nicheOther} onChange={e => set("nicheOther", e.target.value)} />
              </div>
            )}
          </SectionCard>

          {/* ── Section 4: Brand Collaboration & Monetization ── */}
          <SectionCard title="Brand Collaboration & Monetization">

            <div>
              <label className={labelClass}>How do you currently earn from your social media?</label>
              <CheckGroup options={EARN_OPTIONS} selected={form.earnMethods} onChange={v => set("earnMethods", v)} />
              {form.earnMethods.includes("Other") && (
                <input className={inputClass + " mt-3"} placeholder="Please specify..." value={form.earnOther} onChange={e => set("earnOther", e.target.value)} />
              )}
            </div>

            <div>
              <label className={labelClass}>How often do you get brand collaboration opportunities? <span className="text-red-400">*</span></label>
              <RadioGroup options={COLLAB_FREQ} selected={form.collabFreq} onChange={v => set("collabFreq", v)} />
              {errors.collabFreq && <p className={errClass} data-err>{errors.collabFreq}</p>}
            </div>

            <div>
              <label className={labelClass}>How do you usually get collaborations?</label>
              <CheckGroup options={COLLAB_SOURCE} selected={form.collabSource} onChange={v => set("collabSource", v)} />
              {form.collabSource.includes("Other") && (
                <input className={inputClass + " mt-3"} placeholder="Please specify..." value={form.collabSourceOther} onChange={e => set("collabSourceOther", e.target.value)} />
              )}
            </div>

            <div>
              <label className={labelClass}>How is your pricing usually decided?</label>
              <CheckGroup options={PRICING_METHOD} selected={form.pricingMethod} onChange={v => set("pricingMethod", v)} />
              {form.pricingMethod.includes("Other") && (
                <input className={inputClass + " mt-3"} placeholder="Please specify..." value={form.pricingOther} onChange={e => set("pricingOther", e.target.value)} />
              )}
            </div>

            <div>
              <label className={labelClass}>What is your typical paid collaboration price range? <span className="text-red-400">*</span></label>
              <RadioGroup options={PRICE_RANGES} selected={form.priceRange} onChange={v => set("priceRange", v)} />
              {errors.priceRange && <p className={errClass} data-err>{errors.priceRange}</p>}
            </div>

          </SectionCard>

          {/* ── Section 5: Basic Details / KYC ── */}
          <SectionCard title="Basic Details / KYC" description="These details help us verify your profile for Early Access and onboarding. Your information will be kept confidential.">

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Full name <span className="text-red-400">*</span></label>
                <input className={inputClass} placeholder="Your full name" value={form.fullName} onChange={e => set("fullName", e.target.value)} />
                {errors.fullName && <p className={errClass} data-err>{errors.fullName}</p>}
              </div>
              <div>
                <label className={labelClass}>Mobile number <span className="text-red-400">*</span></label>
                <input className={inputClass} type="tel" placeholder="+91 XXXXX XXXXX" value={form.mobile} onChange={e => set("mobile", e.target.value)} />
                {errors.mobile && <p className={errClass} data-err>{errors.mobile}</p>}
              </div>
            </div>

            <div>
              <label className={labelClass}>Email <span className="text-red-400">*</span></label>
              <input className={inputClass} type="email" placeholder="you@example.com" value={form.email} onChange={e => set("email", e.target.value)} />
              {errors.email && <p className={errClass} data-err>{errors.email}</p>}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Location (City/District) <span className="text-red-400">*</span></label>
                <input className={inputClass} placeholder="e.g. Chennai" value={form.city} onChange={e => set("city", e.target.value)} />
                {errors.city && <p className={errClass} data-err>{errors.city}</p>}
              </div>
              <div>
                <label className={labelClass}>State <span className="text-red-400">*</span></label>
                <input className={inputClass} placeholder="e.g. Tamil Nadu" value={form.state} onChange={e => set("state", e.target.value)} />
                {errors.state && <p className={errClass} data-err>{errors.state}</p>}
              </div>
            </div>

            <div>
              <FileInput label="Profile photo" value={form.profilePhoto} onChange={f => set("profilePhoto", f)} accept="image/*" required />
              {errors.profilePhoto && <p className={errClass} data-err>{errors.profilePhoto}</p>}
            </div>

            <div className="pt-2 border-t border-white/5 space-y-4">
              <p className="text-white/30 text-xs uppercase tracking-widest font-semibold">KYC (Optional)</p>
              <div>
                <label className={labelClass}>KYC document type <span className="text-white/30 font-normal">(Optional)</span></label>
                <input className={inputClass} placeholder="e.g. Aadhaar, PAN, Passport..." value={form.kycType} onChange={e => set("kycType", e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>KYC document number <span className="text-white/30 font-normal">(Optional)</span></label>
                <input className={inputClass} placeholder="Document number" value={form.kycNumber} onChange={e => set("kycNumber", e.target.value)} />
              </div>
              <FileInput label="KYC document upload / link" value={form.kycDoc} onChange={f => set("kycDoc", f)} accept="image/*,.pdf" />
            </div>
          </SectionCard>

          {/* submit */}
          <motion.button
            type="submit"
            disabled={submitting}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.99 }}
            className="w-full py-4 rounded-2xl bg-primary text-white font-bold text-lg shadow-[0_0_30px_-5px_rgba(59,130,246,0.5)] hover:shadow-[0_0_40px_-3px_rgba(59,130,246,0.7)] hover:bg-blue-400 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Submitting…" : <>Submit Registration <ChevronRight className="w-5 h-5" /></>}
          </motion.button>

          <p className="text-center text-white/25 text-xs pb-10">
            By submitting, you agree that XQUARE CLUB may use your information for onboarding and communication purposes.
          </p>
        </form>
      </div>
    </div>
  );
}
