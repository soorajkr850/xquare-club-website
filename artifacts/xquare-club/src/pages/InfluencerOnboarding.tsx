import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Upload, ChevronRight } from "lucide-react";

const NICHES = [
  "Fashion & Style", "Beauty & Makeup", "Food & Cooking", "Travel & Lifestyle",
  "Fitness & Health", "Technology & Gadgets", "Gaming", "Education & Learning",
  "Entertainment & Humour", "Finance & Investing", "Parenting & Family",
  "Home & Decor", "Business & Entrepreneurship", "Arts & Crafts",
  "Sports & Outdoors", "Music & Dance", "Spirituality & Wellness",
  "Environment & Sustainability", "Pets & Animals", "Others"
];

const EARN_OPTIONS = [
  "Paid brand collaborations",
  "Affiliate marketing",
  "AdSense / Platform monetization",
  "Own products or merchandise",
  "Freelance content creation",
  "I don't currently earn from social media",
  "Other"
];

const COLLAB_SOURCE = [
  "Brands approach me directly",
  "Through influencer marketing platforms",
  "Through agencies",
  "Through personal network / referrals",
  "I reach out to brands myself",
  "Other"
];

const PRICING_METHOD = [
  "Fixed rate card",
  "Per post / story / reel basis",
  "Negotiated case by case",
  "Based on deliverables",
  "No fixed pricing yet",
  "Other"
];

const PLATFORMS = ["Instagram", "YouTube", "Facebook", "Twitter / X", "LinkedIn", "Snapchat", "TikTok", "Other"];
const FOLLOWER_RANGES = ["Under 1,000", "1,000 – 5,000", "5,000 – 10,000", "10,000 – 50,000", "50,000 – 1 Lakh", "1 Lakh – 5 Lakh", "5 Lakh+"];
const COLLAB_FREQ = ["Regularly (multiple times a month)", "Occasionally (a few times a year)", "Rarely (once or twice)", "Never"];
const PRICE_RANGES = ["Under ₹5,000", "₹5,000 – ₹15,000", "₹15,000 – ₹30,000", "₹30,000 – ₹50,000", "₹50,000+", "Not applicable / Haven't done paid collabs"];
const KYC_TYPES = ["Aadhaar Card", "PAN Card", "Voter ID", "Passport", "Driving Licence"];

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

const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors";
const labelClass = "block text-sm font-medium text-white/80 mb-2";
const errorClass = "text-red-400 text-xs mt-1";

function SectionCard({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 md:p-8 space-y-6"
    >
      <div>
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        {description && <p className="text-white/50 text-sm mt-1">{description}</p>}
      </div>
      {children}
    </motion.div>
  );
}

function CheckGroup({ options, selected, onChange, max }: { options: string[]; selected: string[]; onChange: (v: string[]) => void; max?: number }) {
  const toggle = (opt: string) => {
    if (selected.includes(opt)) {
      onChange(selected.filter(s => s !== opt));
    } else if (!max || selected.length < max) {
      onChange([...selected, opt]);
    }
  };
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {options.map(opt => (
        <label key={opt} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selected.includes(opt) ? "border-primary bg-primary/10 text-white" : "border-white/10 bg-white/[0.02] text-white/70 hover:border-white/30"}`}>
          <div className={`w-4 h-4 rounded flex-shrink-0 border-2 flex items-center justify-center transition-all ${selected.includes(opt) ? "bg-primary border-primary" : "border-white/30"}`}>
            {selected.includes(opt) && <CheckCircle2 className="w-3 h-3 text-white" />}
          </div>
          <span className="text-sm">{opt}</span>
        </label>
      ))}
    </div>
  );
}

function RadioGroup({ options, selected, onChange }: { options: string[]; selected: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-3">
      {options.map(opt => (
        <label key={opt} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selected === opt ? "border-primary bg-primary/10 text-white" : "border-white/10 bg-white/[0.02] text-white/70 hover:border-white/30"}`}>
          <div className={`w-4 h-4 rounded-full flex-shrink-0 border-2 flex items-center justify-center transition-all ${selected === opt ? "border-primary" : "border-white/30"}`}>
            {selected === opt && <div className="w-2 h-2 rounded-full bg-primary" />}
          </div>
          <span className="text-sm">{opt}</span>
        </label>
      ))}
    </div>
  );
}

function FileInput({ label, onChange, accept, required }: { label: string; onChange: (f: File | null) => void; accept?: string; required?: boolean }) {
  const [name, setName] = useState<string>("");
  return (
    <div>
      <label className={labelClass}>{label}{required && <span className="text-red-400 ml-1">*</span>}</label>
      <label className="flex items-center gap-3 p-4 rounded-xl border border-dashed border-white/20 bg-white/[0.02] hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all group">
        <Upload className="w-5 h-5 text-white/40 group-hover:text-primary transition-colors flex-shrink-0" />
        <span className="text-sm text-white/50 group-hover:text-white/70 truncate">
          {name || "Click to upload a file"}
        </span>
        <input type="file" accept={accept} className="hidden" onChange={e => { const f = e.target.files?.[0] || null; onChange(f); setName(f?.name || ""); }} />
      </label>
    </div>
  );
}

export default function InfluencerOnboarding() {
  const [form, setForm] = useState<FormData>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  const set = <K extends keyof FormData>(key: K, val: FormData[K]) =>
    setForm(f => ({ ...f, [key]: val }));

  const validate = () => {
    const e: typeof errors = {};
    if (!form.consent) e.consent = "You must agree to the consent statement.";
    if (!form.platform) e.platform = "Please select your primary platform.";
    if (!form.handle.trim()) e.handle = "Handle is required.";
    if (!form.profileLink.trim()) e.profileLink = "Profile link is required.";
    if (!form.followerRange) e.followerRange = "Please select a follower range.";
    if (form.niches.length === 0) e.niches = "Please select at least one niche.";
    if (!form.collabFreq) e.collabFreq = "Please select a frequency.";
    if (!form.priceRange) e.priceRange = "Please select a price range.";
    if (!form.fullName.trim()) e.fullName = "Full name is required.";
    if (!form.mobile.trim()) e.mobile = "Mobile number is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.city.trim()) e.city = "City / District is required.";
    if (!form.state.trim()) e.state = "State is required.";
    if (!form.profilePhoto) e.profilePhoto = "Profile photo is required.";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const e2 = validate();
    setErrors(e2);
    if (Object.keys(e2).length === 0) setSubmitted(true);
    else {
      const first = document.querySelector("[data-error]");
      first?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-4">You're on the list!</h1>
          <p className="text-white/60 mb-8">Thank you for registering your interest. Our team will review your submission and reach out with the next steps.</p>
          <button onClick={() => window.location.href = "/"} className="px-8 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-blue-400 transition-colors">
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-white/5 bg-black/80 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => window.location.href = "/"} className="text-white/60 hover:text-white text-sm flex items-center gap-1 transition-colors">
            ← Back to site
          </button>
          <img src="/images/xquare-logo.png" alt="XQUARE CLUB" className="h-8 w-auto object-contain" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Page title */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary border border-primary/30 bg-primary/10 rounded-full px-4 py-1.5 mb-4">
            Early Access
          </span>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Influencer Onboarding Form</h1>
          <p className="text-white/50 max-w-xl mx-auto text-sm">
            Please fill out this form to register your interest in Early Access to XQUARE CLUB. Your submitted details will be used for onboarding, verification, and communication purposes.
          </p>
          <p className="text-red-400 text-xs mt-3">* Required fields</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>

          {/* 1. Consent */}
          <SectionCard title="Consent">
            <label className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${form.consent ? "border-primary bg-primary/10" : "border-white/10 hover:border-white/30"}`}>
              <div className={`w-5 h-5 mt-0.5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all ${form.consent ? "bg-primary border-primary" : "border-white/30"}`}>
                {form.consent && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
              </div>
              <span className="text-sm text-white/80 leading-relaxed">
                I am interested in Early Access and I agree that my submitted details may be used for onboarding and communication. <span className="text-red-400">*</span>
              </span>
              <input type="checkbox" className="hidden" checked={form.consent} onChange={e => set("consent", e.target.checked)} />
            </label>
            {errors.consent && <p className={errorClass} data-error>{errors.consent}</p>}
          </SectionCard>

          {/* 2. Social Media Profile Details */}
          <SectionCard title="Social Media Profile Details">
            <div>
              <label className={labelClass}>Primary Social Platform <span className="text-red-400">*</span></label>
              <select className={inputClass} value={form.platform} onChange={e => set("platform", e.target.value)}>
                <option value="" className="bg-gray-900">Select platform</option>
                {PLATFORMS.map(p => <option key={p} value={p} className="bg-gray-900">{p}</option>)}
              </select>
              {errors.platform && <p className={errorClass} data-error>{errors.platform}</p>}
            </div>
            <div>
              <label className={labelClass}>Social Media Username / Handle <span className="text-red-400">*</span></label>
              <input className={inputClass} placeholder="@yourhandle" value={form.handle} onChange={e => set("handle", e.target.value)} />
              {errors.handle && <p className={errorClass} data-error>{errors.handle}</p>}
            </div>
            <div>
              <label className={labelClass}>Social Profile Link <span className="text-red-400">*</span></label>
              <input className={inputClass} type="url" placeholder="https://instagram.com/yourprofile" value={form.profileLink} onChange={e => set("profileLink", e.target.value)} />
              {errors.profileLink && <p className={errorClass} data-error>{errors.profileLink}</p>}
            </div>
          </SectionCard>

          {/* 3. Social Media Dashboard / Insights */}
          <SectionCard title="Social Media Dashboard / Insights">
            <div>
              <label className={labelClass}>Social Media Dashboard Screenshot <span className="text-white/40 font-normal">(Optional)</span></label>
              <FileInput label="" onChange={f => set("dashboardScreenshot", f)} accept="image/*" />
              <p className="text-white/30 text-xs mt-1">Upload a screenshot from your analytics dashboard showing follower count, reach, or engagement.</p>
            </div>
            <div>
              <label className={labelClass}>Follower Count Range <span className="text-red-400">*</span></label>
              <RadioGroup options={FOLLOWER_RANGES} selected={form.followerRange} onChange={v => set("followerRange", v)} />
              {errors.followerRange && <p className={errorClass} data-error>{errors.followerRange}</p>}
            </div>
          </SectionCard>

          {/* 4. Niche */}
          <SectionCard title="Niche" description="Which niche best describes your content? Select up to 10.">
            <CheckGroup options={NICHES} selected={form.niches} onChange={v => set("niches", v)} max={10} />
            {errors.niches && <p className={errorClass} data-error>{errors.niches}</p>}
            {form.niches.includes("Others") && (
              <div>
                <label className={labelClass}>If Others, please specify</label>
                <input className={inputClass} placeholder="Describe your niche..." value={form.nicheOther} onChange={e => set("nicheOther", e.target.value)} />
              </div>
            )}
          </SectionCard>

          {/* 5. Brand Collaboration & Monetization */}
          <SectionCard title="Brand Collaboration & Monetization">
            <div>
              <label className={labelClass}>How do you currently earn from your social media?</label>
              <CheckGroup options={EARN_OPTIONS} selected={form.earnMethods} onChange={v => set("earnMethods", v)} />
              {form.earnMethods.includes("Other") && (
                <div className="mt-3">
                  <input className={inputClass} placeholder="Please specify..." value={form.earnOther} onChange={e => set("earnOther", e.target.value)} />
                </div>
              )}
            </div>
            <div>
              <label className={labelClass}>How often do you get brand collaboration opportunities? <span className="text-red-400">*</span></label>
              <RadioGroup options={COLLAB_FREQ} selected={form.collabFreq} onChange={v => set("collabFreq", v)} />
              {errors.collabFreq && <p className={errorClass} data-error>{errors.collabFreq}</p>}
            </div>
            <div>
              <label className={labelClass}>How do you usually get collaborations?</label>
              <CheckGroup options={COLLAB_SOURCE} selected={form.collabSource} onChange={v => set("collabSource", v)} />
              {form.collabSource.includes("Other") && (
                <div className="mt-3">
                  <input className={inputClass} placeholder="Please specify..." value={form.collabSourceOther} onChange={e => set("collabSourceOther", e.target.value)} />
                </div>
              )}
            </div>
            <div>
              <label className={labelClass}>How is your pricing usually decided?</label>
              <CheckGroup options={PRICING_METHOD} selected={form.pricingMethod} onChange={v => set("pricingMethod", v)} />
              {form.pricingMethod.includes("Other") && (
                <div className="mt-3">
                  <input className={inputClass} placeholder="Please specify..." value={form.pricingOther} onChange={e => set("pricingOther", e.target.value)} />
                </div>
              )}
            </div>
            <div>
              <label className={labelClass}>What is your typical paid collaboration price range? <span className="text-red-400">*</span></label>
              <RadioGroup options={PRICE_RANGES} selected={form.priceRange} onChange={v => set("priceRange", v)} />
              {errors.priceRange && <p className={errorClass} data-error>{errors.priceRange}</p>}
            </div>
          </SectionCard>

          {/* 6. Basic Details / KYC */}
          <SectionCard
            title="Basic Details / KYC"
            description="Note: These details help us verify your profile for Early Access and onboarding. Your information will be kept confidential."
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Full Name <span className="text-red-400">*</span></label>
                <input className={inputClass} placeholder="Your full name" value={form.fullName} onChange={e => set("fullName", e.target.value)} />
                {errors.fullName && <p className={errorClass} data-error>{errors.fullName}</p>}
              </div>
              <div>
                <label className={labelClass}>Mobile Number <span className="text-red-400">*</span></label>
                <input className={inputClass} type="tel" placeholder="+91 XXXXX XXXXX" value={form.mobile} onChange={e => set("mobile", e.target.value)} />
                {errors.mobile && <p className={errorClass} data-error>{errors.mobile}</p>}
              </div>
            </div>
            <div>
              <label className={labelClass}>Email Address <span className="text-red-400">*</span></label>
              <input className={inputClass} type="email" placeholder="you@example.com" value={form.email} onChange={e => set("email", e.target.value)} />
              {errors.email && <p className={errorClass} data-error>{errors.email}</p>}
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>City / District <span className="text-red-400">*</span></label>
                <input className={inputClass} placeholder="e.g. Chennai" value={form.city} onChange={e => set("city", e.target.value)} />
                {errors.city && <p className={errorClass} data-error>{errors.city}</p>}
              </div>
              <div>
                <label className={labelClass}>State <span className="text-red-400">*</span></label>
                <input className={inputClass} placeholder="e.g. Tamil Nadu" value={form.state} onChange={e => set("state", e.target.value)} />
                {errors.state && <p className={errorClass} data-error>{errors.state}</p>}
              </div>
            </div>
            <div>
              <FileInput label="Profile Photo" onChange={f => set("profilePhoto", f)} accept="image/*" required />
              {errors.profilePhoto && <p className={errorClass} data-error>{errors.profilePhoto}</p>}
            </div>

            <div className="border-t border-white/5 pt-6 space-y-4">
              <p className="text-white/40 text-xs uppercase tracking-widest font-semibold">KYC (Optional)</p>
              <div>
                <label className={labelClass}>KYC Document Type</label>
                <select className={inputClass} value={form.kycType} onChange={e => set("kycType", e.target.value)}>
                  <option value="" className="bg-gray-900">Select document type</option>
                  {KYC_TYPES.map(t => <option key={t} value={t} className="bg-gray-900">{t}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>KYC Document Number</label>
                <input className={inputClass} placeholder="Document number" value={form.kycNumber} onChange={e => set("kycNumber", e.target.value)} />
              </div>
              <FileInput label="KYC Document Upload" onChange={f => set("kycDoc", f)} accept="image/*,.pdf" />
            </div>
          </SectionCard>

          {/* Submit */}
          <motion.button
            type="submit"
            whileHover={{ y: -2 }}
            whileTap={{ y: 0, scale: 0.99 }}
            className="w-full py-4 rounded-2xl bg-primary text-white font-bold text-lg shadow-[0_0_30px_-5px_rgba(59,130,246,0.5)] hover:shadow-[0_0_40px_-3px_rgba(59,130,246,0.7)] hover:bg-blue-400 transition-all flex items-center justify-center gap-2"
          >
            Submit Registration
            <ChevronRight className="w-5 h-5" />
          </motion.button>

          <p className="text-center text-white/30 text-xs pb-8">
            By submitting, you agree that XQUARE CLUB may use your information for onboarding and communication purposes.
          </p>
        </form>
      </div>
    </div>
  );
}
