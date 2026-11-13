"use client";

import React from "react";
import { UserCheck, FileText, Handshake, ShieldCheck } from "lucide-react";

interface HowItWorksProps {
  translations: {
    title: string;
    subtitle: string;
    step1: { title: string; description: string };
    step2: { title: string; description: string };
    step3: { title: string; description: string };
    step4: { title: string; description: string };
  };
}

export function HowItWorks({ translations }: HowItWorksProps) {
  const steps = [
    {
      num: "01",
      icon: <UserCheck className="w-6 h-6 text-[#d4956b]" />,
      title: translations.step1.title,
      description: translations.step1.description,
    },
    {
      num: "02",
      icon: <FileText className="w-6 h-6 text-sky-400" />,
      title: translations.step2.title,
      description: translations.step2.description,
    },
    {
      num: "03",
      icon: <Handshake className="w-6 h-6 text-purple-400" />,
      title: translations.step3.title,
      description: translations.step3.description,
    },
    {
      num: "04",
      icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
      title: translations.step4.title,
      description: translations.step4.description,
    },
  ];

  return (
    <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          {translations.title}
        </h2>
        <p className="mt-4 text-base sm:text-lg text-gray-400">
          {translations.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="p-6 rounded-3xl bg-[#0c0e17] border border-[#23273b] hover:border-[#b87333]/40 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 rounded-2xl bg-[#141724] border border-[#23273b]">
                  {step.icon}
                </div>
                <span className="text-2xl font-black font-mono text-[#23273b] group-hover:text-[#b87333]/50 transition-colors">
                  {step.num}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#d4956b] transition-colors">
                {step.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                {step.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#1a1d2e] flex items-center gap-2 text-[11px] font-mono text-gray-500 uppercase">
              <span>Phase {step.num} of 04</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
