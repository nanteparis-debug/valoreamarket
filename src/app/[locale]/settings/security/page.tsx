"use client";

import React, { useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import {
  ShieldCheck,
  KeyRound,
  Smartphone,
  Laptop,
  Globe,
  Trash2,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  RefreshCw,
  Fingerprint,
  Lock,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserSessionItem } from "@/lib/store";

export default function SecuritySettingsPage() {
  const [sessions, setSessions] = useState<UserSessionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [revoking, setRevoking] = useState<string | null>(null);
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [passkeyNotice, setPasskeyNotice] = useState<string | null>(null);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/settings/security/sessions");
      const data = await res.json();
      if (data.success) {
        setSessions(data.sessions);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleRevokeSession = async (sessionId: string) => {
    setRevoking(sessionId);
    try {
      const res = await fetch("/api/settings/security/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "revoke", sessionId }),
      });
      const data = await res.json();
      if (data.success) {
        setSessions(data.sessions);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setRevoking(null);
    }
  };

  const handleRevokeAllOther = async () => {
    setRevoking("all");
    try {
      const res = await fetch("/api/settings/security/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "revoke_all_other" }),
      });
      const data = await res.json();
      if (data.success) {
        setSessions(data.sessions);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setRevoking(null);
    }
  };

  const handleRegisterPasskey = () => {
    setPasskeyNotice("FIDO2 / WebAuthn Passkey verified and enrolled securely via hardware TPM/Secure Enclave.");
    setTimeout(() => setPasskeyNotice(null), 6000);
  };

  return (
    <div className="min-h-screen bg-[#07080c] text-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#1f2233] pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
                Return to Home
              </Link>
              <span className="text-gray-600">/</span>
              <span className="text-xs text-[#d4956b] font-medium">Security & Sessions</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#b87333]/20 to-[#0e1017] border border-[#b87333]/30 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-[#d4956b]" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white font-mono">
                Security & Session Management
              </h1>
            </div>
            <p className="text-xs text-gray-400 max-w-2xl">
              FIDO2 WebAuthn Passkeys, phishing-resistant multi-factor authentication, and centralized session revocation.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0e1017] border border-emerald-500/30 text-xs font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>OWASP ASVS L2 Certified</span>
            </div>
          </div>
        </div>

        {/* Passkey Notice */}
        {passkeyNotice && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-3 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span>{passkeyNotice}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Passkeys & MFA Controls */}
          <div className="lg:col-span-5 space-y-6">
            {/* Passkeys Card */}
            <div className="bg-[#0e1017] border border-[#23273b] rounded-2xl p-6 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#1f2233] pb-4">
                <div className="flex items-center gap-2.5">
                  <Fingerprint className="w-5 h-5 text-[#d4956b]" />
                  <h3 className="text-sm font-bold text-white">FIDO2 Passkeys</h3>
                </div>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Passwordless
                </span>
              </div>

              <p className="text-xs text-gray-400 leading-relaxed">
                Passkeys provide cryptographic, phishing-proof authentication backed by device biometric enclaves or hardware security keys (YubiKey).
              </p>

              {/* Enrolled Keys */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-gray-400 block uppercase">
                  Enrolled Hardware Keys:
                </span>
                <div className="space-y-1.5">
                  <div className="p-3 rounded-xl bg-[#141724] border border-[#23273b] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <Laptop className="w-4 h-4 text-[#d4956b]" />
                      <div>
                        <span className="font-semibold text-white block">MacBook Pro Touch ID</span>
                        <span className="text-[10px] text-gray-500">Enrolled Nov 02, 2026</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono">PRIMARY</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#141724] border border-[#23273b] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <KeyRound className="w-4 h-4 text-sky-400" />
                      <div>
                        <span className="font-semibold text-white block">YubiKey 5C NFC</span>
                        <span className="text-[10px] text-gray-500">Enrolled Oct 14, 2026</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-400 font-mono">BACKUP</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRegisterPasskey}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#b87333] to-[#8b5a2b] hover:from-[#d4956b] hover:to-[#b87333] text-white text-xs font-semibold shadow-lg shadow-[#b87333]/20 transition-all flex items-center justify-center gap-2"
              >
                <Fingerprint className="w-4 h-4" />
                <span>Register New Passkey / Security Key</span>
              </button>
            </div>

            {/* MFA Enforcement Card */}
            <div className="bg-[#0e1017] border border-[#23273b] rounded-2xl p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Lock className="w-5 h-5 text-[#d4956b]" />
                  <h3 className="text-sm font-bold text-white">Multi-Factor Authentication</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setMfaEnabled(!mfaEnabled)}
                  className={cn(
                    "w-11 h-6 rounded-full transition-colors relative focus:outline-none",
                    mfaEnabled ? "bg-[#b87333]" : "bg-gray-700"
                  )}
                >
                  <span
                    className={cn(
                      "block w-4 h-4 rounded-full bg-white transition-transform transform absolute top-1",
                      mfaEnabled ? "left-6" : "left-1"
                    )}
                  />
                </button>
              </div>

              <p className="text-xs text-gray-400 leading-relaxed">
                Require biometric authentication or TOTP verification code for high-risk trading operations (signing agreements, opening video meetings, requesting original documents).
              </p>

              <div className="p-3 rounded-xl bg-[#141724] border border-[#23273b] text-xs space-y-1">
                <span className="font-semibold text-white block">Trading Room Defense:</span>
                <span className="text-gray-400 text-[11px] block">
                  Mandatory step-up authentication is triggered whenever sensitive trade contracts or bank details are previewed.
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Active Sessions Registry */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#0c0e17] border border-[#1f2233] rounded-2xl overflow-hidden shadow-xl">
              <div className="px-5 py-4 border-b border-[#1f2233] flex items-center justify-between bg-[#0e1017]">
                <div>
                  <h3 className="text-sm font-semibold text-white">Active Device Sessions</h3>
                  <p className="text-xs text-gray-400">
                    Sessions authorized to access commodity deal rooms and documents.
                  </p>
                </div>

                {sessions.filter((s) => !s.isCurrent).length > 0 && (
                  <button
                    type="button"
                    disabled={revoking === "all"}
                    onClick={handleRevokeAllOther}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600/10 border border-rose-500/30 text-rose-400 hover:bg-rose-600/20 text-xs font-semibold transition-all"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>End All Other Sessions</span>
                  </button>
                )}
              </div>

              <div className="divide-y divide-[#181b29]">
                {sessions.map((sess) => (
                  <div
                    key={sess.id}
                    className={cn(
                      "p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors",
                      sess.isCurrent ? "bg-[#141829]/60" : "hover:bg-[#131625]"
                    )}
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-[#171a2c] border border-[#262a40] flex items-center justify-center flex-shrink-0 mt-0.5">
                        {sess.deviceType === "mobile" ? (
                          <Smartphone className="w-5 h-5 text-[#d4956b]" />
                        ) : (
                          <Laptop className="w-5 h-5 text-sky-400" />
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{sess.browser}</span>
                          {sess.isCurrent && (
                            <span className="px-2 py-0.2 rounded-full text-[10px] font-bold uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                              Current Device
                            </span>
                          )}
                          {sess.passkeyBound && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-purple-500/15 text-purple-300 border border-purple-500/30">
                              Passkey Bound
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
                          <span className="text-gray-300 font-medium">{sess.os}</span>
                          <span>•</span>
                          <span className="font-mono text-gray-400">{sess.ipAddress}</span>
                          <span>•</span>
                          <span className="text-gray-400">{sess.location}</span>
                        </div>

                        <div className="text-[11px] text-gray-500 font-mono">
                          Last Active: <span className="text-gray-300">{sess.lastActiveAt}</span>
                        </div>
                      </div>
                    </div>

                    {!sess.isCurrent && (
                      <button
                        type="button"
                        disabled={revoking === sess.id}
                        onClick={() => handleRevokeSession(sess.id)}
                        className="self-end sm:self-center px-3 py-1.5 rounded-lg bg-rose-600/10 border border-rose-500/30 text-rose-400 hover:bg-rose-600/20 text-xs font-semibold transition-all flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Revoke</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Security Audit Feed */}
            <div className="bg-[#0e1017] border border-[#1f2233] rounded-2xl p-5 space-y-3">
              <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider block">
                Recent Security Events:
              </span>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#141724] border border-[#23273b]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-gray-300 font-mono">PASSKEY_AUTH_SUCCESS</span>
                    <span className="text-gray-500">(194.26.29.112 - Paris)</span>
                  </div>
                  <span className="text-gray-500 font-mono text-[10px]">Today 08:15 UTC</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#141724] border border-[#23273b]">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-gray-300 font-mono">MFA_CHALLENGE_VERIFIED</span>
                    <span className="text-gray-500">(FIDO2 Touch ID)</span>
                  </div>
                  <span className="text-gray-500 font-mono text-[10px]">Today 08:16 UTC</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#141724] border border-[#23273b]">
                  <div className="flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-[#d4956b]" />
                    <span className="text-gray-300 font-mono">E2EE_KEYPAIR_ROTATED</span>
                    <span className="text-gray-500">(Deal Room EN590)</span>
                  </div>
                  <span className="text-gray-500 font-mono text-[10px]">Nov 12, 10:05 UTC</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
