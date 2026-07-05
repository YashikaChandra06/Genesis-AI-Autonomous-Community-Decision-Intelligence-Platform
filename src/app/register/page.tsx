"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Cpu, Mail, Lock, User, Shield, AlertCircle, ArrowRight } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { authService } from "@/services/firebase";

export default function RegisterPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "operator" | "member">("member");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Track auth state to redirect if already logged in
  useEffect(() => {
    const unsub = authService.onAuthState((user) => {
      if (user) {
        router.push("/dashboard");
      }
    });
    return () => unsub();
  }, [router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName || !email || !password) {
      setError("Please fill in all standard credentials.");
      return;
    }
    if (password.length < 6) {
      setError("Access code must be at least 6 characters long.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      await authService.signUp(email, password, displayName, role);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create security profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07070a] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />

      {/* Logo Header */}
      <div className="mb-8 flex flex-col items-center space-y-2">
        <Link href="/" className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white">GENESIS AI</span>
        </Link>
        <span className="text-xs text-neutral-500">Security Profile Management Console</span>
      </div>

      <GlassCard className="w-full max-w-md border border-white/5 p-8 relative z-10" glow>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white">Create Security Profile</h2>
          <p className="text-xs text-neutral-400">Register credentials and establish role-based clearance.</p>
        </div>

        {error && (
          <div className="mb-4 bg-rose-500/10 border border-rose-500/25 text-rose-400 rounded-lg p-3 text-xs flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-400">Full Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-neutral-500">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Taylor Reese"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-400">Security Email</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-neutral-500">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                placeholder="operator@genesis.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-400">Clearance Access Code (Password)</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-neutral-500">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-400 font-sans flex items-center space-x-1">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>Assigned Security Clearance Role</span>
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as "admin" | "operator" | "member")}
              className="w-full bg-neutral-900 border border-white/10 rounded-lg py-2.5 px-3 text-sm text-white focus:outline-none focus:border-cyan-500/50"
              disabled={loading}
            >
              <option value="member">Community Member (Read-Only)</option>
              <option value="operator">Operations Manager (Manage Alerts & Simulator)</option>
              <option value="admin">System Administrator (Full Access)</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-white text-black hover:bg-neutral-200 py-3 rounded-lg font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg"
            disabled={loading}
          >
            <span>{loading ? "Establishing Profile..." : "Register Security Account"}</span>
            {!loading && <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-neutral-400">
          Already registered?{" "}
          <Link href="/login" className="text-cyan-400 font-semibold hover:underline">
            Sign In to Profile
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}
