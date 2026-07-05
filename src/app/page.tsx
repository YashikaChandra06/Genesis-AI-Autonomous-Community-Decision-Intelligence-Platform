"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Cpu, 
  Map, 
  ShieldAlert, 
  Zap, 
  ChevronRight, 
  FileText, 
  Users
} from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState("map");
  const [livePulse, setLivePulse] = useState(true);

  // Quick heartbeat animation effect
  useEffect(() => {
    const timer = setInterval(() => {
      setLivePulse(prev => !prev);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#07070a] text-white flex flex-col relative overflow-hidden selection:bg-purple-500/30 selection:text-purple-300">
      
      {/* Background Decorative Mesh Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[60%] rounded-full bg-purple-900/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[60%] rounded-full bg-cyan-900/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] left-[30%] w-[350px] h-[350px] rounded-full bg-indigo-900/10 blur-[90px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/5 py-4 px-6 md:px-12 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">GENESIS</span>
            <span className="font-semibold text-xs ml-1 text-purple-400 border border-purple-500/30 px-1.5 py-0.5 rounded bg-purple-500/5">AI</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-neutral-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#platform" className="hover:text-white transition-colors">Architecture</a>
          <a href="#telemetry" className="hover:text-white transition-colors">Live Feed</a>
        </nav>

        <div className="flex items-center space-x-4">
          <Link 
            href="/login" 
            className="text-sm font-medium text-neutral-400 hover:text-white transition-colors px-4 py-2"
          >
            Sign In
          </Link>
          <Link 
            href="/register" 
            className="text-sm font-medium bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-lg shadow-lg shadow-purple-500/10 border border-purple-400/20 transition-all duration-200"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 max-w-7xl mx-auto px-6 md:px-12 pt-16 md:pt-28 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        <div className="lg:col-span-6 space-y-8 text-left">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-neutral-300 font-medium"
          >
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            <span>Next-Generation Decision Support System</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight"
          >
            Autonomous <br />
            <span className="bg-gradient-to-r from-purple-400 via-indigo-200 to-cyan-300 bg-clip-text text-transparent">
              Community Decision
            </span> <br />
            Intelligence
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-neutral-400 text-base md:text-lg max-w-xl leading-relaxed"
          >
            Genesis AI is a high-performance full-stack intelligence platform. We monitor real-time urban telemetry, model multi-hazard risk zones, simulate cascading disasters, and generate predictive AI recommendations powered by Google Gemini.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-4 pt-2"
          >
            <Link 
              href="/login" 
              className="flex items-center space-x-2 bg-white text-black hover:bg-neutral-200 px-6 py-3.5 rounded-xl font-bold transition-all shadow-xl shadow-white/5 text-sm"
            >
              <span>Launch Console</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
            
            <a 
              href="#features"
              className="flex items-center space-x-2 bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-3.5 rounded-xl font-bold transition-all text-sm text-neutral-300"
            >
              <span>Explore Features</span>
            </a>
          </motion.div>

          {/* Quick Stats Grid */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-3 gap-6 pt-6 border-t border-white/5"
          >
            <div>
              <div className="text-2xl font-bold text-white">84%</div>
              <div className="text-xs text-neutral-500">Health Index</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-cyan-400">92%</div>
              <div className="text-xs text-neutral-500">Traffic Flow</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">&lt; 4.8m</div>
              <div className="text-xs text-neutral-500">Response Speed</div>
            </div>
          </motion.div>
        </div>

        {/* Hero Interactive Console Preview */}
        <div className="lg:col-span-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            {/* Background Glow Ring */}
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-cyan-500/10 blur-3xl rounded-3xl" />

            {/* Dashboard Container Box */}
            <div className="relative rounded-2xl border border-white/10 bg-[#0d0d12]/90 shadow-2xl overflow-hidden glass">
              
              {/* Header Ticker */}
              <div className="bg-[#121218] border-b border-white/5 px-5 py-3.5 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/70" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/70" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/70" />
                </div>
                <div className="text-[10px] text-neutral-500 font-mono tracking-widest uppercase flex items-center space-x-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full bg-emerald-400 ${livePulse ? "scale-125 opacity-100" : "scale-100 opacity-60"} transition-all duration-300`} />
                  <span>Telemetry Engine: ACTIVE</span>
                </div>
              </div>

              {/* Sidebar Tabs & Sandbox Content */}
              <div className="grid grid-cols-12 md:h-[350px]">
                
                {/* Console Side Menu */}
                <div className="col-span-3 border-r border-white/5 p-3 space-y-1.5 bg-black/10">
                  <button 
                    onClick={() => setActiveTab("map")}
                    className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium flex items-center space-x-2 transition-all ${activeTab === "map" ? "bg-white/10 text-white" : "text-neutral-400 hover:bg-white/5 hover:text-white"}`}
                  >
                    <Map className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Smart Map</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab("ai")}
                    className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium flex items-center space-x-2 transition-all ${activeTab === "ai" ? "bg-white/10 text-white" : "text-neutral-400 hover:bg-white/5 hover:text-white"}`}
                  >
                    <Cpu className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Gemini Support</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab("simulator")}
                    className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium flex items-center space-x-2 transition-all ${activeTab === "simulator" ? "bg-white/10 text-white" : "text-neutral-400 hover:bg-white/5 hover:text-white"}`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Disaster Sim</span>
                  </button>
                </div>

                {/* Console viewport */}
                <div className="col-span-9 p-5 flex flex-col justify-between">
                  {activeTab === "map" && (
                    <div className="space-y-4 h-full flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-sm font-bold text-white">Smart City Geo-Sensing</h4>
                          <p className="text-[11px] text-neutral-400">Sector-wise grid mapping and incident markers.</p>
                        </div>
                        <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-2 py-0.5 border border-cyan-500/20 rounded font-semibold">OSM Dynamic</span>
                      </div>
                      
                      {/* Mini Graphic Map Simulator */}
                      <div className="flex-1 bg-black/35 rounded-lg border border-white/5 relative overflow-hidden flex items-center justify-center p-3 h-28">
                        <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:16px_16px]" />
                        
                        {/* Map Graphic circles */}
                        <div className="w-16 h-16 rounded-full border border-purple-500/20 bg-purple-500/5 animate-pulse absolute top-4 left-6" />
                        <div className="w-24 h-24 rounded-full border border-cyan-500/10 bg-cyan-500/5 absolute bottom-1 right-6" />
                        
                        {/* Fake marker */}
                        <div className="absolute top-10 left-12 flex flex-col items-center">
                          <span className="w-2 h-2 rounded-full bg-rose-500" />
                          <span className="text-[8px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-1 mt-1 rounded font-mono">INCIDENT</span>
                        </div>
                        <div className="absolute bottom-6 right-16 flex flex-col items-center">
                          <span className="w-2 h-2 rounded-full bg-cyan-400" />
                          <span className="text-[8px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-1 mt-1 rounded font-mono">HOSPITAL</span>
                        </div>
                      </div>

                      <div className="text-[11px] text-neutral-400 flex items-center justify-between border-t border-white/5 pt-2">
                        <span>Active Incidents: <strong>3 Priority</strong></span>
                        <Link href="/login" className="text-purple-400 font-semibold hover:underline flex items-center">
                          Launch Map <ChevronRight className="w-3 h-3 ml-0.5" />
                        </Link>
                      </div>
                    </div>
                  )}

                  {activeTab === "ai" && (
                    <div className="space-y-4 h-full flex flex-col justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-white">Gemini Decision Assistant</h4>
                        <p className="text-[11px] text-neutral-400">Contextual community optimization questions.</p>
                      </div>
                      
                      <div className="space-y-2 font-mono text-[11px]">
                        <div className="bg-white/5 p-2 rounded border border-white/5 text-neutral-300">
                          <span className="text-purple-400">user:</span> Recommend ambulance deployment.
                        </div>
                        <div className="bg-purple-950/20 p-2.5 rounded border border-purple-500/25 text-neutral-200">
                          <span className="text-cyan-400 font-bold">gemini-flash:</span> ICU occupancies indicate Saint Jude at 91% capacity. Redirect ambulance units AMB-102 and AMB-105 to City General Clinic (62%).
                        </div>
                      </div>

                      <div className="text-[11px] border-t border-white/5 pt-2 text-right">
                        <Link href="/login" className="text-purple-400 font-semibold hover:underline flex items-center justify-end">
                          Ask Gemini <ChevronRight className="w-3 h-3 ml-0.5" />
                        </Link>
                      </div>
                    </div>
                  )}

                  {activeTab === "simulator" && (
                    <div className="space-y-4 h-full flex flex-col justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-white">Disaster Risk Cascading</h4>
                        <p className="text-[11px] text-neutral-400">Simulate incidents to forecast municipal impacts.</p>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        {["Heavy Rain", "Power Fail", "Disease Outbreak"].map((sim, i) => (
                          <div key={i} className="bg-white/5 border border-white/10 p-2.5 rounded-lg text-center hover:bg-white/10 transition-colors cursor-pointer">
                            <Zap className="w-4 h-4 mx-auto mb-1 text-amber-400 animate-pulse" />
                            <span className="text-[10px] font-semibold text-neutral-300">{sim}</span>
                          </div>
                        ))}
                      </div>

                      <div className="text-[11px] text-neutral-400 flex items-center justify-between border-t border-white/5 pt-2">
                        <span>Cascading Risk Score: <strong className="text-rose-400">Elevated</strong></span>
                        <Link href="/login" className="text-purple-400 font-semibold hover:underline flex items-center">
                          Simulate Hazard <ChevronRight className="w-3 h-3 ml-0.5" />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

              </div>

            </div>
          </motion.div>
        </div>

      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-6 md:px-12 py-24 relative z-10 border-t border-white/5">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">Platform Features</h2>
          <p className="text-neutral-400 text-sm md:text-base">
            Equipped with state-of-the-art technologies designed to ingest regional metadata, calculate risk scores, and support operational deployments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <GlassCard glow hoverScale className="border border-white/5 space-y-4">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Gemini Decision Engine</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Synthesize multi-modal telemetry streams instantly. Generates responsive advisory guides, dispatch recommendations, and traffic mitigations.
            </p>
          </GlassCard>

          <GlassCard glow hoverScale className="border border-white/5 space-y-4">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Map className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Smart City Geo-Sensing</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Renders incident locations, shelters, police divisions, and health sectors. Implements responsive routing maps using Leaflet rendering.
            </p>
          </GlassCard>

          <GlassCard glow hoverScale className="border border-white/5 space-y-4">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Multi-Hazard Simulator</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Inject heavy storm overlays, route grid closures, or outbreak parameters. Model and visualize cascading municipal failure pipelines using React Flow.
            </p>
          </GlassCard>

          <GlassCard glow hoverScale className="border border-white/5 space-y-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">PDF Executive Reporter</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Instantly compile complex telemetry summaries, AI incident directives, and risk cascading sheets into styled, shareable, client-downloadable PDF files.
            </p>
          </GlassCard>

          <GlassCard glow hoverScale className="border border-white/5 space-y-4">
            <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Alert Dispatch Matrix</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Categorizes alerts across Critical, High, Medium, and Low risk. Sends instant visual pings to corresponding departments to accelerate rescue times.
            </p>
          </GlassCard>

          <GlassCard glow hoverScale className="border border-white/5 space-y-4">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Role Access Control</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Features layered profile configurations for Administrators, Operators, and Community members. Implements Google Authentication seamlessly.
            </p>
          </GlassCard>
        </div>
      </section>

      {/* Deployment & Setup details */}
      <section id="platform" className="max-w-7xl mx-auto px-6 md:px-12 py-16 relative z-10 border-t border-white/5 bg-white/[0.01]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-extrabold tracking-tight">Zero-Setup Server Deployment</h2>
            <p className="text-neutral-400 text-sm md:text-base leading-relaxed">
              Genesis AI is configured for quick production deployment directly to Render. The platform builds as a single self-contained project with built-in sandbox fallbacks for database APIs and Gemini engines when credentials aren&apos;t loaded.
            </p>
            <ul className="space-y-3 font-medium text-xs text-neutral-300">
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                <span>Next.js 15 App Router Route Handlers for API endpoints.</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                <span>Render web service container layout support (`render.yaml`).</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                <span>Graceful LocalStorage database replication wrapper.</span>
              </li>
            </ul>
          </div>
          
          <GlassCard className="font-mono text-xs p-6 bg-black/45 border border-white/5 text-purple-300 space-y-4">
            <div className="flex justify-between text-neutral-500 border-b border-white/5 pb-2 text-[10px]">
              <span>SETUP CONFIGURATION (render.yaml)</span>
              <span>YAML</span>
            </div>
            <pre className="text-neutral-400 overflow-x-auto whitespace-pre-wrap select-all">
{`services:
  - type: web
    name: genesis-ai
    env: node
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: GEMINI_API_KEY
        sync: false
      - key: NEXT_PUBLIC_FIREBASE_API_KEY
        sync: false`}
            </pre>
          </GlassCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-xs text-neutral-500 bg-[#07070a] relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-purple-400" />
            <span>Genesis AI © 2026. Production Ready.</span>
          </div>
          <div className="flex space-x-6 text-neutral-400">
            <Link href="/login" className="hover:text-white">Console</Link>
            <Link href="/register" className="hover:text-white">Register</Link>
            <a href="https://render.com" target="_blank" rel="noreferrer" className="hover:text-white">Render Deploy</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
