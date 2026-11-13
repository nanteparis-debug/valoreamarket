"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import { ArrowLeft, Cookie } from "lucide-react";

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-[#07080c] text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="flex items-center gap-2 border-b border-[#1f2233] pb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
            Home
          </Link>
          <span className="text-gray-600">/</span>
          <span className="text-xs text-[#d4956b] font-medium">Cookie Policy</span>
        </div>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#b87333]/15 border border-[#b87333]/30 text-xs font-mono text-[#d4956b]">
            <Cookie className="w-3.5 h-3.5" />
            <span>Zero Third-Party Advertising Trackers</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-mono">
            Cookie & Session Storage Policy
          </h1>
          <p className="text-xs text-gray-400 font-mono">
            Last Updated: November 13, 2026
          </p>
        </div>

        <div className="bg-[#0e1017] border border-[#23273b] rounded-2xl p-8 space-y-6 text-xs text-gray-300 leading-relaxed shadow-xl">
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider text-[#d4956b]">
              1. Our Cookie Philosophy
            </h2>
            <p>
              GVCE respects institutional privacy. We exclusively deploy strictly necessary functional cookies required to maintain your authentication state and language preference. We do not use third-party behavioral advertising cookies or marketing tracking pixels.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider text-[#d4956b]">
              2. Cookies Deployed
            </h2>
            <div className="border border-[#1f2233] rounded-xl overflow-hidden mt-2">
              <div className="grid grid-cols-12 bg-[#121422] p-2.5 text-gray-400 font-medium border-b border-[#1f2233]">
                <div className="col-span-3">Cookie Name</div>
                <div className="col-span-3">Purpose</div>
                <div className="col-span-3">Duration</div>
                <div className="col-span-3">Category</div>
              </div>
              <div className="grid grid-cols-12 p-2.5 border-b border-[#181b29]">
                <div className="col-span-3 font-mono text-[#d4956b]">NEXT_LOCALE</div>
                <div className="col-span-3 text-gray-400">Stores preferred UI language (8 supported)</div>
                <div className="col-span-3 text-gray-400">1 Year</div>
                <div className="col-span-3 text-emerald-400 font-mono">Strictly Necessary</div>
              </div>
              <div className="grid grid-cols-12 p-2.5 border-b border-[#181b29]">
                <div className="col-span-3 font-mono text-[#d4956b]">gvce_session_token</div>
                <div className="col-span-3 text-gray-400">Encrypted JWT user authentication session</div>
                <div className="col-span-3 text-gray-400">Session / 24 Hours</div>
                <div className="col-span-3 text-emerald-400 font-mono">Strictly Necessary</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
