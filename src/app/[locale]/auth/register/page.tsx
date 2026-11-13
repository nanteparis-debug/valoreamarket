"use client";

import React, { useState } from "react";
import { useRouter } from "@/i18n/routing";
import {
  Building2,
  FileBadge2,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function RegisterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [companyName, setCompanyName] = useState("");
  const [regNumber, setRegNumber] = useState("");
  const [country, setCountry] = useState("FR");
  const [repName, setRepName] = useState("");
  const [repEmail, setRepEmail] = useState("");
  const [role, setRole] = useState("buyer");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#07080c] text-[#f8fafc] flex flex-col justify-center items-center p-4">
      <div className="max-w-2xl w-full rounded-3xl bg-[#0c0e17] border border-[#23273b] p-8 sm:p-10 shadow-2xl space-y-6">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
          <span>Back to Home</span>
        </button>

        {submitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              Verification File Submitted
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto">
              Your KYB & KYC application for <strong className="text-white">{companyName}</strong> has been forwarded to the GVCE Compliance & Sanctions Officer for review.
            </p>
            <div className="p-3 rounded-xl bg-[#141724] border border-[#23273b] text-xs font-mono text-[#d4956b] inline-block">
              Review Status: PENDING_REVIEW (Est. 4-12 Hours)
            </div>
            <div className="pt-4">
              <button
                onClick={() => router.push("/deals/deal-en590-rotterdam/room")}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#b87333] to-[#8b5a2b] text-white text-xs font-semibold"
              >
                Access Demo Deal Room
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121420] border border-[#23273b] text-xs font-mono text-[#d4956b] mb-2">
                <FileBadge2 className="w-3.5 h-3.5" />
                <span>KYB & KYC Multi-Stage Verification</span>
              </div>
              <h1 className="text-2xl font-bold text-white">
                Register Verified Enterprise
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                Enter your legal company credentials to qualify for international brokerage deal rooms.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Company Legal Name</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. TotalEnergies Trading SA"
                  className="w-full bg-[#121422] border border-[#23273b] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#b87333]"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1">Commercial Registration Number</label>
                <input
                  type="text"
                  required
                  value={regNumber}
                  onChange={(e) => setRegNumber(e.target.value)}
                  placeholder="e.g. RCS Paris 542 051 180"
                  className="w-full bg-[#121422] border border-[#23273b] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#b87333]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Country of Registration</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-[#121422] border border-[#23273b] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#b87333]"
                >
                  <option value="FR">France (FR)</option>
                  <option value="SA">Saudi Arabia (SA)</option>
                  <option value="AE">United Arab Emirates (AE)</option>
                  <option value="US">United States (US)</option>
                  <option value="DE">Germany (DE)</option>
                  <option value="MA">Morocco (MA)</option>
                  <option value="JP">Japan (JP)</option>
                  <option value="CN">China (CN)</option>
                  <option value="BR">Brazil (BR)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1">Primary Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-[#121422] border border-[#23273b] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#b87333]"
                >
                  <option value="buyer">Qualified Buyer</option>
                  <option value="supplier">Certified Producer / Supplier</option>
                  <option value="both">Both (Integrated Trader)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Authorized Representative Full Name</label>
                <input
                  type="text"
                  required
                  value={repName}
                  onChange={(e) => setRepName(e.target.value)}
                  placeholder="e.g. Jean-Luc Dubois"
                  className="w-full bg-[#121422] border border-[#23273b] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#b87333]"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1">Representative Corporate Email</label>
                <input
                  type="email"
                  required
                  value={repEmail}
                  onChange={(e) => setRepEmail(e.target.value)}
                  placeholder="jl.dubois@totalenergies.com"
                  className="w-full bg-[#121422] border border-[#23273b] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#b87333]"
                />
              </div>
            </div>

            {/* Document Upload Simulation */}
            <div className="p-4 rounded-2xl bg-[#0f111a] border border-[#23273b] space-y-2">
              <span className="text-xs text-gray-300 font-semibold block">
                Commercial Registry Certificate & Power of Attorney
              </span>
              <div className="border border-dashed border-[#2f354d] hover:border-[#b87333] rounded-xl p-4 text-center cursor-pointer transition-colors">
                <Upload className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                <span className="text-xs text-gray-400">
                  Click or drag official PDF certificate (Max 25 MB)
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#b87333] to-[#8b5a2b] hover:from-[#d4956b] hover:to-[#b87333] text-white text-xs font-semibold shadow-lg shadow-[#b87333]/20 flex items-center justify-center gap-2 transition-all"
            >
              <span>Submit for Compliance Verification</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
