import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Upload, X, ChevronDown } from "lucide-react";

/* ── shared styles ── */
const inp =
  "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors";
const sel =
  "w-full bg-[#0d0d0d] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors appearance-none";
const lbl = "block text-sm font-medium text-white/80 mb-2";
const err = "text-red-400 text-xs mt-1.5";
const radio =
  "flex items-center gap-3 cursor-pointer group";
const radioInner =
  "w-4 h-4 rounded-full border-2 border-white/30 group-has-[:checked]:border-blue-500 group-has-[:checked]:bg-blue-500 flex items-center justify-center shrink-0 transition-colors";

const STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa",
  "Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala",
  "Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland",
  "Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
  "Uttar Pradesh","Uttarakhand","West Bengal",
  "Andaman & Nicobar Islands","Chandigarh","Dadra & Nagar Haveli and Daman & Diu",
  "Delhi","Jammu & Kashmir","Ladakh","Lakshadweep","Puducherry",
];

const NATURE_OPTIONS = [
  "Proprietorship","Partnership","LLP","Private Limited","Public Limited","OPC","Other",
];

const CATEGORY_OPTIONS = [
  "Fashion / Clothing","Beauty / Personal Care","Food / Beverages","Home & Living",
  "Electronics / Gadgets","Health / Wellness","Kids / Baby Products",
  "Jewellery / Accessories","Other",
];

const PRICE_RANGE_OPTIONS = [
  "Below ₹500","₹500 – ₹1,000","₹1,001 – ₹2,500","₹2,501 – ₹5,000","Above ₹5,000",
];

const ONLINE_CHANNEL_OPTIONS = [
  "Own Website","Instagram","Facebook","WhatsApp","Amazon","Flipkart","Meesho",
  "Other Marketplace","Other",
];

const OFFLINE_CHANNEL_OPTIONS = [
  "Physical Store","Distributor Network","Resellers","Exhibitions / Events",
  "Direct Sales","Other",
];

type F = {
  /* §1 */
  businessName: string; contactName: string; mobile: string; email: string;
  address: string; city: string; state: string; pinCode: string;
  /* §2 */
  natureOfBusiness: string; natureOther: string;
  msmeRegistered: string; businessRegId: string; gstNumber: string;
  verificationDoc: File | null;
  /* §3 */
  products: string; productCategories: string[]; categoryOther: string;
  avgPriceRange: string;
  /* §4 */
  competitorPricing: string; priceDifference: string;
  avgMargin: string; avgMonthlySales: string;
  /* §5 */
  salesChannels: string; onlineChannels: string[]; onlineOther: string;
  offlineChannels: string[]; offlineOther: string;
  /* §6 */
  usesErpCrm: string; erpCrmName: string; interestedInErpCrm: string;
  /* §7 */
  interestedInInfluencers: string; additionalDetails: string;
};

const INIT: F = {
  businessName:"", contactName:"", mobile:"", email:"",
  address:"", city:"", state:"", pinCode:"",
  natureOfBusiness:"", natureOther:"",
  msmeRegistered:"", businessRegId:"", gstNumber:"", verificationDoc:null,
  products:"", productCategories:[], categoryOther:"", avgPriceRange:"",
  competitorPricing:"", priceDifference:"", avgMargin:"", avgMonthlySales:"",
  salesChannels:"", onlineChannels:[], onlineOther:"",
  offlineChannels:[], offlineOther:"",
  usesErpCrm:"", erpCrmName:"", interestedInErpCrm:"",
  interestedInInfluencers:"", additionalDetails:"",
};


/* ── helpers ── */
function SectionHeader({ n, title }: { n: number; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center shrink-0">
        <span className="text-blue-400 text-sm font-bold">{n}</span>
      </div>
      <h2 className="text-lg font-semibold text-white">{title}</h2>
    </div>
  );
}

function RadioGroup({
  name, options, value, onChange,
}: { name: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-2">
      {options.map(opt => (
        <label key={opt} className={radio}>
          <input
            type="radio"
            name={name}
            value={opt}
            checked={value === opt}
            onChange={() => onChange(opt)}
            className="sr-only"
          />
          <div className={`w-4 h-4 rounded-full border-2 shrink-0 transition-colors flex items-center justify-center ${
            value === opt ? "border-blue-500 bg-blue-500" : "border-white/30"
          }`}>
            {value === opt && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
          </div>
          <span className="text-sm text-white/80">{opt}</span>
        </label>
      ))}
    </div>
  );
}

function CheckboxGroup({
  options, value, onChange,
}: { options: string[]; value: string[]; onChange: (v: string[]) => void }) {
  const toggle = (opt: string) =>
    onChange(value.includes(opt) ? value.filter(x => x !== opt) : [...value, opt]);
  return (
    <div className="space-y-2">
      {options.map(opt => (
        <label key={opt} className="flex items-center gap-3 cursor-pointer">
          <div className={`w-4 h-4 rounded border shrink-0 flex items-center justify-center transition-colors ${
            value.includes(opt) ? "bg-blue-500 border-blue-500" : "border-white/30 bg-transparent"
          }`}>
            {value.includes(opt) && (
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
          <span className="text-sm text-white/80">{opt}</span>
          <input type="checkbox" checked={value.includes(opt)} onChange={() => toggle(opt)} className="sr-only" />
        </label>
      ))}
    </div>
  );
}

function FileUpload({
  value, onChange,
}: { value: File | null; onChange: (f: File | null) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div>
      {value ? (
        <div className="flex items-center gap-3 bg-blue-500/10 border border-blue-500/30 rounded-xl px-4 py-3">
          <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
          <span className="text-sm text-white/80 truncate flex-1">{value.name}</span>
          <button type="button" onClick={() => onChange(null)} className="text-white/40 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => ref.current?.click()}
          className="w-full border-2 border-dashed border-white/15 rounded-xl py-8 flex flex-col items-center gap-2 hover:border-blue-500/40 hover:bg-blue-500/5 transition-colors"
        >
          <Upload className="w-6 h-6 text-white/30" />
          <span className="text-sm text-white/40">Click to upload</span>
          <span className="text-xs text-white/25">PDF, JPG, PNG accepted</span>
        </button>
      )}
      <input
        ref={ref}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        className="hidden"
        onChange={e => onChange(e.target.files?.[0] ?? null)}
      />
    </div>
  );
}

/* ── main component ── */
export default function BusinessListing() {
  const [form, setForm] = useState<F>(INIT);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = <K extends keyof F>(k: K, v: F[K]) => setForm(f => ({ ...f, [k]: v }));

  /* validation */
  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.businessName.trim()) e.businessName = "Required.";
    if (!form.contactName.trim())  e.contactName  = "Required.";
    if (!form.mobile.trim())       e.mobile       = "Required.";
    if (!form.email.trim())        e.email        = "Required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.address.trim())      e.address      = "Required.";
    if (!form.city.trim())         e.city         = "Required.";
    if (!form.state)               e.state        = "Required.";
    if (!form.pinCode.trim())      e.pinCode      = "Required.";
    if (!form.natureOfBusiness)    e.natureOfBusiness = "Required.";
    if (form.natureOfBusiness === "Other" && !form.natureOther.trim())
      e.natureOther = "Please specify.";
    if (!form.msmeRegistered)      e.msmeRegistered = "Required.";
    if (!form.products.trim())     e.products     = "Required.";
    if (!form.productCategories.length) e.productCategories = "Select at least one.";
    if (form.productCategories.includes("Other") && !form.categoryOther.trim())
      e.categoryOther = "Please specify.";
    if (!form.avgPriceRange)       e.avgPriceRange = "Required.";
    if (!form.competitorPricing)   e.competitorPricing = "Required.";
    if (!form.avgMargin.trim())    e.avgMargin    = "Required.";
    if (!form.avgMonthlySales.trim()) e.avgMonthlySales = "Required.";
    if (!form.salesChannels)       e.salesChannels = "Required.";
    if (!form.usesErpCrm)          e.usesErpCrm   = "Required.";
    if (!form.interestedInErpCrm)  e.interestedInErpCrm = "Required.";
    if (!form.interestedInInfluencers) e.interestedInInfluencers = "Required.";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) {
      const first = document.querySelector("[data-err]");
      first?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v instanceof File) fd.append(k, v);
        else if (Array.isArray(v)) fd.append(k, v.join(", "));
        else if (v !== null && v !== undefined) fd.append(k, String(v));
      });
      const res = await fetch("https://xquare-club--techzitlearners.replit.app/api/business-listing", { method: "POST", body: fd });
      if (!res.ok) throw new Error(`${res.status}`);
    } catch (ex) {
      console.error("Submission error:", ex);
    }
    setSubmitting(false);
    setSubmitted(true);
  };

  /* success screen */
  if (submitted) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-blue-500" />
          </div>
          <h1 className="text-3xl font-bold mb-4">You're registered!</h1>
          <p className="text-white/60 mb-8">
            Thank you for registering your business. Our team will review your details and reach out to you shortly.
          </p>
          <button
            onClick={() => window.location.href = "/"}
            className="px-8 py-3 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-400 transition-colors"
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* top bar */}
      <div className="sticky top-0 z-40 border-b border-white/5 bg-black/80 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => window.location.href = "/"} className="text-white/50 hover:text-white text-sm transition-colors">← Back</button>
          <img src="/images/xquare-logo.png" alt="XQUARE CLUB" className="h-8 w-auto object-contain" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 pt-12 pb-20">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

          {/* header */}
          <div className="mb-10 text-center">
            <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium tracking-wide uppercase mb-4">
              Seller Onboarding
            </span>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Apply as a Seller</h1>
            <p className="text-white/50 mb-2">
              Submit your application to join XQUARE CLUB as a seller. Your details will be used for review, verification, onboarding, and communication purposes.
            </p>
            <p className="text-red-400 text-xs">* Required Fields</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-8">

            {/* ── SECTION 1 ── */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 md:p-8">
              <SectionHeader n={1} title="Basic Business Details" />
              <div className="space-y-5">

                <div>
                  <label className={lbl}>Business / Brand Name <span className="text-red-400">*</span></label>
                  <input className={inp} type="text" placeholder="Your brand name" value={form.businessName} onChange={e => set("businessName", e.target.value)} />
                  {errors.businessName && <p className={err} data-err>{errors.businessName}</p>}
                </div>

                <div>
                  <label className={lbl}>Contact Person Name <span className="text-red-400">*</span></label>
                  <input className={inp} type="text" placeholder="Full name" value={form.contactName} onChange={e => set("contactName", e.target.value)} />
                  {errors.contactName && <p className={err} data-err>{errors.contactName}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={lbl}>Mobile Number <span className="text-red-400">*</span></label>
                    <input className={inp} type="tel" placeholder="+91 XXXXX XXXXX" value={form.mobile} onChange={e => set("mobile", e.target.value)} />
                    {errors.mobile && <p className={err} data-err>{errors.mobile}</p>}
                  </div>
                  <div>
                    <label className={lbl}>Email Address <span className="text-red-400">*</span></label>
                    <input className={inp} type="email" placeholder="you@example.com" value={form.email} onChange={e => set("email", e.target.value)} />
                    {errors.email && <p className={err} data-err>{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <label className={lbl}>Business Address <span className="text-red-400">*</span></label>
                  <textarea className={`${inp} resize-none`} rows={3} placeholder="Street address, landmark…" value={form.address} onChange={e => set("address", e.target.value)} />
                  {errors.address && <p className={err} data-err>{errors.address}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className={lbl}>City <span className="text-red-400">*</span></label>
                    <input className={inp} type="text" placeholder="City" value={form.city} onChange={e => set("city", e.target.value)} />
                    {errors.city && <p className={err} data-err>{errors.city}</p>}
                  </div>
                  <div>
                    <label className={lbl}>State <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <select className={sel} value={form.state} onChange={e => set("state", e.target.value)}>
                        <option value="">Select state</option>
                        {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                    </div>
                    {errors.state && <p className={err} data-err>{errors.state}</p>}
                  </div>
                  <div>
                    <label className={lbl}>PIN Code <span className="text-red-400">*</span></label>
                    <input className={inp} type="text" placeholder="6-digit PIN" maxLength={6} value={form.pinCode} onChange={e => set("pinCode", e.target.value)} />
                    {errors.pinCode && <p className={err} data-err>{errors.pinCode}</p>}
                  </div>
                </div>

              </div>
            </div>

            {/* ── SECTION 2 ── */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 md:p-8">
              <SectionHeader n={2} title="KYC / Business Identity" />
              <div className="space-y-6">

                <div>
                  <label className={lbl}>Nature of Business <span className="text-red-400">*</span></label>
                  <RadioGroup name="natureOfBusiness" options={NATURE_OPTIONS} value={form.natureOfBusiness} onChange={v => set("natureOfBusiness", v)} />
                  {errors.natureOfBusiness && <p className={err} data-err>{errors.natureOfBusiness}</p>}
                  <AnimatePresence>
                    {form.natureOfBusiness === "Other" && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-3 overflow-hidden">
                        <input className={inp} type="text" placeholder="Please specify…" value={form.natureOther} onChange={e => set("natureOther", e.target.value)} />
                        {errors.natureOther && <p className={err} data-err>{errors.natureOther}</p>}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div>
                  <label className={lbl}>MSME Registered? <span className="text-red-400">*</span></label>
                  <RadioGroup name="msmeRegistered" options={["Yes", "No"]} value={form.msmeRegistered} onChange={v => set("msmeRegistered", v)} />
                  {errors.msmeRegistered && <p className={err} data-err>{errors.msmeRegistered}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={lbl}>Business Registration ID <span className="text-white/30 font-normal">(Optional)</span></label>
                    <input className={inp} type="text" placeholder="Reg. ID" value={form.businessRegId} onChange={e => set("businessRegId", e.target.value)} />
                  </div>
                  <div>
                    <label className={lbl}>GST Registration Number <span className="text-white/30 font-normal">(Optional)</span></label>
                    <input className={inp} type="text" placeholder="GSTIN" value={form.gstNumber} onChange={e => set("gstNumber", e.target.value)} />
                  </div>
                </div>

                <div>
                  <label className={lbl}>Upload Business Verification Document <span className="text-white/30 font-normal">(Optional)</span></label>
                  <p className="text-xs text-white/30 mb-3">Upload any ONE supporting document such as GST Certificate, MSME Certificate, Partnership Deed, Business Registration Certificate, etc.</p>
                  <FileUpload value={form.verificationDoc} onChange={f => set("verificationDoc", f)} />
                </div>

              </div>
            </div>

            {/* ── SECTION 3 ── */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 md:p-8">
              <SectionHeader n={3} title="Business & Product Information" />
              <div className="space-y-6">

                <div>
                  <label className={lbl}>What products do you sell? <span className="text-red-400">*</span></label>
                  <textarea className={`${inp} resize-none`} rows={3} placeholder="Describe your products…" value={form.products} onChange={e => set("products", e.target.value)} />
                  {errors.products && <p className={err} data-err>{errors.products}</p>}
                </div>

                <div>
                  <label className={lbl}>Product Category <span className="text-red-400">*</span></label>
                  <CheckboxGroup options={CATEGORY_OPTIONS} value={form.productCategories} onChange={v => set("productCategories", v)} />
                  {errors.productCategories && <p className={err} data-err>{errors.productCategories}</p>}
                  <AnimatePresence>
                    {form.productCategories.includes("Other") && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-3 overflow-hidden">
                        <input className={inp} type="text" placeholder="Please specify…" value={form.categoryOther} onChange={e => set("categoryOther", e.target.value)} />
                        {errors.categoryOther && <p className={err} data-err>{errors.categoryOther}</p>}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div>
                  <label className={lbl}>Average Price Range of Your Products <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <select className={sel} value={form.avgPriceRange} onChange={e => set("avgPriceRange", e.target.value)}>
                      <option value="">Select a range</option>
                      {PRICE_RANGE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                  </div>
                  {errors.avgPriceRange && <p className={err} data-err>{errors.avgPriceRange}</p>}
                </div>

              </div>
            </div>

            {/* ── SECTION 4 ── */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 md:p-8">
              <SectionHeader n={4} title="Pricing & Business Performance" />
              <div className="space-y-6">

                <div>
                  <label className={lbl}>Compared to competitors, your pricing is: <span className="text-red-400">*</span></label>
                  <RadioGroup name="competitorPricing" options={["Lower than competitors","Similar to competitors","Higher than competitors"]} value={form.competitorPricing} onChange={v => set("competitorPricing", v)} />
                  {errors.competitorPricing && <p className={err} data-err>{errors.competitorPricing}</p>}
                </div>

                <div>
                  <label className={lbl}>Approximate price difference from competitors <span className="text-white/30 font-normal">(Optional)</span></label>
                  <input className={inp} type="text" placeholder="e.g. ₹100 lower, 10% higher, similar pricing…" value={form.priceDifference} onChange={e => set("priceDifference", e.target.value)} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={lbl}>Average Margin per Product (₹) <span className="text-red-400">*</span></label>
                    <input className={inp} type="number" placeholder="0" min="0" value={form.avgMargin} onChange={e => set("avgMargin", e.target.value)} />
                    {errors.avgMargin && <p className={err} data-err>{errors.avgMargin}</p>}
                  </div>
                  <div>
                    <label className={lbl}>Average Monthly Sales (₹) <span className="text-red-400">*</span></label>
                    <input className={inp} type="number" placeholder="0" min="0" value={form.avgMonthlySales} onChange={e => set("avgMonthlySales", e.target.value)} />
                    {errors.avgMonthlySales && <p className={err} data-err>{errors.avgMonthlySales}</p>}
                  </div>
                </div>

              </div>
            </div>

            {/* ── SECTION 5 ── */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 md:p-8">
              <SectionHeader n={5} title="Sales Channels" />
              <div className="space-y-6">

                <div>
                  <label className={lbl}>Channels of Sale <span className="text-red-400">*</span></label>
                  <RadioGroup name="salesChannels" options={["Online","Offline","Both"]} value={form.salesChannels} onChange={v => set("salesChannels", v)} />
                  {errors.salesChannels && <p className={err} data-err>{errors.salesChannels}</p>}
                </div>

                <AnimatePresence>
                  {(form.salesChannels === "Online" || form.salesChannels === "Both") && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <div className="pt-2">
                        <label className={lbl}>Online channels you use <span className="text-white/30 font-normal">(Optional)</span></label>
                        <CheckboxGroup options={ONLINE_CHANNEL_OPTIONS} value={form.onlineChannels} onChange={v => set("onlineChannels", v)} />
                        <AnimatePresence>
                          {form.onlineChannels.includes("Other") && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-3 overflow-hidden">
                              <input className={inp} type="text" placeholder="Specify other online channel…" value={form.onlineOther} onChange={e => set("onlineOther", e.target.value)} />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {(form.salesChannels === "Offline" || form.salesChannels === "Both") && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <div className="pt-2">
                        <label className={lbl}>Offline channels you use <span className="text-white/30 font-normal">(Optional)</span></label>
                        <CheckboxGroup options={OFFLINE_CHANNEL_OPTIONS} value={form.offlineChannels} onChange={v => set("offlineChannels", v)} />
                        <AnimatePresence>
                          {form.offlineChannels.includes("Other") && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-3 overflow-hidden">
                              <input className={inp} type="text" placeholder="Specify other offline channel…" value={form.offlineOther} onChange={e => set("offlineOther", e.target.value)} />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            </div>

            {/* ── SECTION 6 ── */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 md:p-8">
              <SectionHeader n={6} title="Business Systems / Software" />
              <div className="space-y-6">

                <div>
                  <label className={lbl}>Are you currently using any ERP or CRM software? <span className="text-red-400">*</span></label>
                  <RadioGroup name="usesErpCrm" options={["Yes","No"]} value={form.usesErpCrm} onChange={v => set("usesErpCrm", v)} />
                  {errors.usesErpCrm && <p className={err} data-err>{errors.usesErpCrm}</p>}
                  <AnimatePresence>
                    {form.usesErpCrm === "Yes" && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-3 overflow-hidden">
                        <input className={inp} type="text" placeholder="Software name…" value={form.erpCrmName} onChange={e => set("erpCrmName", e.target.value)} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div>
                  <label className={lbl}>Interested in an affordable custom ERP / CRM for your business? <span className="text-red-400">*</span></label>
                  <RadioGroup name="interestedInErpCrm" options={["Yes","No","Maybe / Would like to know more"]} value={form.interestedInErpCrm} onChange={v => set("interestedInErpCrm", v)} />
                  {errors.interestedInErpCrm && <p className={err} data-err>{errors.interestedInErpCrm}</p>}
                </div>

              </div>
            </div>

            {/* ── SECTION 7 ── */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 md:p-8">
              <SectionHeader n={7} title="Platform Readiness" />
              <div className="space-y-6">

                <div>
                  <label className={lbl}>Interested in promoting your products through influencers on XQUARE CLUB? <span className="text-red-400">*</span></label>
                  <RadioGroup name="interestedInInfluencers" options={["Yes","No","Would like to know more"]} value={form.interestedInInfluencers} onChange={v => set("interestedInInfluencers", v)} />
                  {errors.interestedInInfluencers && <p className={err} data-err>{errors.interestedInInfluencers}</p>}
                </div>

                <div>
                  <label className={lbl}>Any additional details about your business <span className="text-white/30 font-normal">(Optional)</span></label>
                  <textarea className={`${inp} resize-none`} rows={4} placeholder="Anything else you'd like us to know…" value={form.additionalDetails} onChange={e => set("additionalDetails", e.target.value)} />
                </div>

              </div>
            </div>

            {/* submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-xl bg-blue-500 text-white font-semibold text-base hover:bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? "Submitting…" : "Submit Registration"}
            </button>

          </form>
        </motion.div>
      </div>
    </div>
  );
}
