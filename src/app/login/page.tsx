"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Cpu, Mail, Lock, AlertCircle, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { authService, isMockMode } from "@/services/firebase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    
    setError("");
    setLoading(true);
    try {
      await authService.signIn(email, password);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to log in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await authService.signInWithGoogle();
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  // Fast developer bypass to easily explore the dashboard!
  const triggerQuickLogin = async (role: "admin" | "operator") => {
    setError("");
    setLoading(true);
    try {
      const emailMap = {
        admin: "admin@genesis.ai",
        operator: "operator@genesis.ai"
      };
      
      if (isMockMode) {
        // Create mock user if doesn't exist, and log in
        try {
          await authService.signUp(
            emailMap[role], 
            "password123", 
            role === "admin" ? "Alex Carter (Operator)" : "Taylor Reese (Technician)", 
            role
          );
        } catch {
          // Already exists, just sign in
          await authService.signIn(emailMap[role], "password123");
        }
      } else {
        // Production mode, attempt signing in
        await authService.signIn(emailMap[role], "password123");
      }
      
      router.push("/dashboard");
    } catch (err) {
      setError(`Quick login failed. Reason: ${err instanceof Error ? err.message : String(err)}. Please register manually.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07070a] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none" />

      {/* Logo Header */}
      <div className="mb-8 flex flex-col items-center space-y-2">
        <Link href="/" className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white">GENESIS AI</span>
        </Link>
        <span className="text-xs text-neutral-500">Community Decision Intelligence Console</span>
      </div>

      <GlassCard className="w-full max-w-md border border-white/5 p-8 relative z-10" glow>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white">System Authentication</h2>
          <p className="text-xs text-neutral-400">Log in to monitor city telemetry and trigger recommendations.</p>
        </div>

        {error && (
          <div className="mb-4 bg-rose-500/10 border border-rose-500/25 text-rose-400 rounded-lg p-3 text-xs flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="space-y-4">
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
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-400">Security Access Code (Password)</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-neutral-500">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-white text-black hover:bg-neutral-200 py-3 rounded-lg font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg"
            disabled={loading}
          >
            <span>{loading ? "Authenticating..." : "Establish Secure Link"}</span>
            {!loading && <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </form>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/5"></div>
          </div>
          <span className="relative bg-[#0d0d12] px-3 text-[10px] text-neutral-500 uppercase tracking-widest font-semibold">or authenticate via</span>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full bg-white/5 border border-white/10 hover:bg-white/10 py-2.5 rounded-lg text-xs font-semibold text-neutral-300 flex items-center justify-center space-x-2 transition-colors cursor-pointer"
          disabled={loading}
        >
          <svg className="w-4 h-4 mr-1 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.529-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.985 0-.74-.078-1.3-.177-1.85h-10.616z" />
          </svg>
          <span>Federated Google Sign In</span>
        </button>

        {/* Quick Sandbox Login Section */}
        <div className="mt-8 border-t border-white/5 pt-6 space-y-3 bg-white/[0.01] p-4 rounded-lg">
          <div className="flex items-center space-x-1.5 text-xs text-purple-400 font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sandbox Mode Shortcuts</span>
          </div>
          <p className="text-[10px] text-neutral-500">Instant logins bypass registration. Simulates client session variables.</p>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => triggerQuickLogin("admin")}
              className="bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 py-2 rounded text-[10px] text-purple-300 font-semibold cursor-pointer transition-colors flex items-center justify-center space-x-1"
              disabled={loading}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Login as Admin</span>
            </button>
            <button
              onClick={() => triggerQuickLogin("operator")}
              className="bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 py-2 rounded text-[10px] text-cyan-300 font-semibold cursor-pointer transition-colors flex items-center justify-center space-x-1"
              disabled={loading}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Login as Operator</span>
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-neutral-400">
          New to the Platform?{" "}
          <Link href="/register" className="text-purple-400 font-semibold hover:underline">
            Register Security Profile
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}
