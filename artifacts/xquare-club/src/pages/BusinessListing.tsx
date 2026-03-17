import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const inputClass =
  "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors";
const labelClass = "block text-sm font-medium text-white/80 mb-2";
const errClass = "text-red-400 text-xs mt-1.5";

type FormState = {
  firstName: string;
  lastName: string;
  businessName: string;
};

const initial: FormState = { firstName: "", lastName: "", businessName: "" };

export default function BusinessListing() {
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = <K extends keyof FormState>(key: K, val: string) =>
    setForm(f => ({ ...f, [key]: val }));

  const validate = () => {
    const e: typeof errors = {};
    if (!form.firstName.trim())    e.firstName    = "First name is required.";
    if (!form.lastName.trim())     e.lastName     = "Last name is required.";
    if (!form.businessName.trim()) e.businessName = "Business name is required.";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSubmitting(true);

    try {
      const res = await fetch("/api/business-listing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
    } catch (err) {
      console.error("Submission error:", err);
    }

    setSubmitting(false);
    setSubmitted(true);
  };

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
      {/* nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => window.location.href = "/"} className="flex items-center gap-2">
            <img src="/images/xquare-logo.png" alt="XQUARE CLUB" className="h-8 w-auto" />
          </button>
          <button
            onClick={() => window.location.href = "/"}
            className="text-sm text-white/50 hover:text-white transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </nav>

      {/* form */}
      <div className="max-w-xl mx-auto px-6 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-10 text-center">
            <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium tracking-wide uppercase mb-4">
              List Your Business
            </span>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Join XQUARE CLUB</h1>
            <p className="text-white/50">
              Register your business for early access and connect with influencers who can help you grow.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 md:p-8 space-y-6">

              {/* First Name */}
              <div>
                <label className={labelClass}>
                  First Name <span className="text-red-400">*</span>
                </label>
                <input
                  className={inputClass}
                  type="text"
                  placeholder="Enter your first name"
                  value={form.firstName}
                  onChange={e => set("firstName", e.target.value)}
                />
                {errors.firstName && <p className={errClass} data-err>{errors.firstName}</p>}
              </div>

              {/* Last Name */}
              <div>
                <label className={labelClass}>
                  Last Name <span className="text-red-400">*</span>
                </label>
                <input
                  className={inputClass}
                  type="text"
                  placeholder="Enter your last name"
                  value={form.lastName}
                  onChange={e => set("lastName", e.target.value)}
                />
                {errors.lastName && <p className={errClass} data-err>{errors.lastName}</p>}
              </div>

              {/* Business Name */}
              <div>
                <label className={labelClass}>
                  Your Business <span className="text-red-400">*</span>
                </label>
                <input
                  className={inputClass}
                  type="text"
                  placeholder="Enter your business name"
                  value={form.businessName}
                  onChange={e => set("businessName", e.target.value)}
                />
                {errors.businessName && <p className={errClass} data-err>{errors.businessName}</p>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-xl bg-blue-500 text-white font-semibold text-base hover:bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-2"
              >
                {submitting ? "Submitting…" : "Submit"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
