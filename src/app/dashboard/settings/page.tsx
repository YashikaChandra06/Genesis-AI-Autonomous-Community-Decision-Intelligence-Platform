"use client";

import React, { useState, useEffect } from "react";
import {
  User, 
  Key, 
  CheckCircle2, 
  Info,
  Save
} from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { authService, UserProfile, isMockMode } from "@/services/firebase";

export default function SettingsPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  
  // API Keys state (stored locally in sessionStorage or state for demonstration/review)
  const [geminiKey, setGeminiKey] = useState("");
  const [firebaseKey, setFirebaseKey] = useState("");
  const [mapsKey, setMapsKey] = useState("");

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingKeys, setSavingKeys] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    // Get user details
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(currentUser);
      setDisplayName(currentUser.displayName);
      setEmail(currentUser.email);
    }

    // Load mock keys if present in storage
    if (typeof window !== "undefined") {
      setGeminiKey(sessionStorage.getItem("genesis_user_gemini_key") || "");
      setFirebaseKey(sessionStorage.getItem("genesis_user_firebase_key") || "");
      setMapsKey(sessionStorage.getItem("genesis_user_maps_key") || "");
    }
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setMsg("");
    
    // Simulate API update
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (user) {
      const updated = { ...user, displayName, email };
      // Update in localStorage mock
      if (typeof window !== "undefined") {
        const users = JSON.parse(localStorage.getItem("genesis_users") || "{}");
        users[user.uid] = updated;
        localStorage.setItem("genesis_users", JSON.stringify(users));
        // Force session update
        window.dispatchEvent(new Event("genesis-auth-changed"));
      }
      setMsg("Operational profile updated successfully.");
    }
    setSavingProfile(false);
  };

  const handleSaveKeys = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingKeys(true);
    setMsg("");

    await new Promise(resolve => setTimeout(resolve, 1000));

    if (typeof window !== "undefined") {
      sessionStorage.setItem("genesis_user_gemini_key", geminiKey);
      sessionStorage.setItem("genesis_user_firebase_key", firebaseKey);
      sessionStorage.setItem("genesis_user_maps_key", mapsKey);
      setMsg("Telemetry API tokens configured.");
    }
    setSavingKeys(false);
  };

  return (
    <div className="space-y-6 flex-1">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            Console Settings
          </h1>
          <p className="text-neutral-400 text-xs md:text-sm mt-1">Configure security profiles, API keys, and telemetric data connections.</p>
        </div>
      </div>

      {msg && (
        <div className="bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 rounded-lg p-3.5 text-xs flex items-center space-x-2 text-left">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Profile */}
        <div className="lg:col-span-6 space-y-6">
          <GlassCard className="border border-white/5 p-6 space-y-4">
            <div className="flex items-center space-x-2 border-b border-white/5 pb-2">
              <User className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Operational Profile</h3>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs text-left">
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-neutral-400">Security Clearance Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-3 text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500/50"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-neutral-400">Clearance Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-3 text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500/50"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-neutral-400">Clearance Role</label>
                <input
                  type="text"
                  value={user?.role?.toUpperCase() || "MEMBER"}
                  className="w-full bg-white/5 border border-white/5 rounded-lg py-2.5 px-3 text-neutral-500 select-all focus:outline-none cursor-not-allowed"
                  disabled
                />
              </div>

              <button
                type="submit"
                className="w-full bg-white text-black hover:bg-neutral-200 py-2.5 rounded-lg font-bold text-xs flex items-center justify-center space-x-2 transition-colors cursor-pointer mt-2"
                disabled={savingProfile}
              >
                <Save className="w-3.5 h-3.5" />
                <span>{savingProfile ? "Saving Profile..." : "Update Credentials"}</span>
              </button>
            </form>
          </GlassCard>
        </div>

        {/* Right Side: API Keys */}
        <div className="lg:col-span-6 space-y-6">
          <GlassCard className="border border-white/5 p-6 space-y-4">
            <div className="flex items-center space-x-2 border-b border-white/5 pb-2">
              <Key className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">API Integrations</h3>
            </div>

            <form onSubmit={handleSaveKeys} className="space-y-4 text-xs text-left">
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-neutral-400">Gemini Generative API Key</label>
                <input
                  type="password"
                  placeholder={process.env.GEMINI_API_KEY ? "••••••••••••••••" : "Input API Key..."}
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-3 text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500/50"
                />
                <span className="text-[9px] text-neutral-500 block mt-1">Powers the Decision Support Gemini AI Agent.</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-neutral-400">Firebase Configuration ID</label>
                <input
                  type="password"
                  placeholder={process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "••••••••••••••••" : "Input Firebase App Key..."}
                  value={firebaseKey}
                  onChange={(e) => setFirebaseKey(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-3 text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-neutral-400">Google Maps SDK Token</label>
                <input
                  type="password"
                  placeholder="Input Maps Token..."
                  value={mapsKey}
                  onChange={(e) => setMapsKey(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-3 text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500/50"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-500 text-white py-2.5 rounded-lg font-bold text-xs flex items-center justify-center space-x-2 transition-colors cursor-pointer mt-2"
                disabled={savingKeys}
              >
                <Save className="w-3.5 h-3.5" />
                <span>{savingKeys ? "Saving Tokens..." : "Apply API Configurations"}</span>
              </button>
            </form>
          </GlassCard>

          {/* Connection diagnostics */}
          <GlassCard className="border border-white/5 p-4 space-y-3.5 text-xs text-left">
            <h4 className="font-bold text-white">System Diagnostics</h4>
            <div className="space-y-2 font-mono text-[10px]">
              <div className="flex items-center justify-between">
                <span>Database Client:</span>
                <span className={isMockMode ? "text-amber-400" : "text-emerald-400"}>
                  {isMockMode ? "LocalStorage Sandboxed" : "Firebase Real-time Connected"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Gemini API Node:</span>
                <span className={process.env.GEMINI_API_KEY ? "text-emerald-400" : "text-amber-400"}>
                  {process.env.GEMINI_API_KEY ? "Keys Injected" : "Simulated Intelligence"}
                </span>
              </div>
            </div>
            <div className="text-[10px] text-neutral-500 flex items-start space-x-1.5 border-t border-white/5 pt-2">
              <Info className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
              <span>To transition to cloud storage, fill in variables inside `.env` or set them on Render.</span>
            </div>
          </GlassCard>
        </div>

      </div>
    </div>
  );
}
