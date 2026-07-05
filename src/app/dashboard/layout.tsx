"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Cpu, 
  LayoutDashboard, 
  Map, 
  MessageSquareCode, 
  Sparkles, 
  BellRing, 
  FilePieChart, 
  Settings, 
  ShieldAlert, 
  LogOut, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  User 
} from "lucide-react";
import { authService, UserProfile, isMockMode } from "@/services/firebase";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  // Authentication Guard
  useEffect(() => {
    const unsub = authService.onAuthState((currentUser) => {
      if (!currentUser) {
        // Not logged in, send to login
        router.push("/login");
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    });

    return () => unsub();
  }, [router]);

  // Sync Theme settings on boot
  useEffect(() => {
    const savedTheme = localStorage.getItem("genesis_theme") as "dark" | "light";
    if (savedTheme === "light") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTheme("light");
      document.body.classList.add("light-theme");
    } else {
      setTheme("dark");
      document.body.classList.remove("light-theme");
    }
  }, []);

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
      localStorage.setItem("genesis_theme", "light");
      document.body.classList.add("light-theme");
    } else {
      setTheme("dark");
      localStorage.setItem("genesis_theme", "dark");
      document.body.classList.remove("light-theme");
    }
  };

  const handleSignOut = async () => {
    try {
      await authService.signOut();
      router.push("/login");
    } catch (error) {
      console.error("Sign out failed", error);
    }
  };

  // Nav menu items definition
  const menuItems = [
    { name: "Overview", path: "/dashboard", icon: LayoutDashboard },
    { name: "Smart City Map", path: "/dashboard/map", icon: Map },
    { name: "Gemini AI Agent", path: "/dashboard/assistant", icon: MessageSquareCode },
    { name: "Scenario Simulator", path: "/dashboard/simulator", icon: Sparkles },
    { name: "Incident Alerts", path: "/dashboard/alerts", icon: BellRing },
    { name: "Reports Engine", path: "/dashboard/reports", icon: FilePieChart },
    { name: "Profile Settings", path: "/dashboard/settings", icon: Settings },
  ];

  // Admin-only route option
  const adminMenuItem = { name: "System Admin", path: "/dashboard/admin", icon: ShieldAlert };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07070a] text-white flex flex-col items-center justify-center space-y-4">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-purple-500/20"
        >
          <Cpu className="w-6 h-6 text-white" />
        </motion.div>
        <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest animate-pulse">Syncing Cryptographic Session...</span>
      </div>
    );
  }

  if (!user) return null;

  const isAdmin = user.role === "admin";
  const displayedMenuItems = isAdmin ? [...menuItems, adminMenuItem] : menuItems;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#08080c] text-white relative">
      
      {/* Sidebar - Desktop Layout */}
      <aside className="hidden md:flex flex-col w-64 border-r border-white/5 bg-[#0b0b10] shrink-0 justify-between select-none">
        <div>
          {/* Logo brand */}
          <div className="p-6 border-b border-white/5 flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-400 flex items-center justify-center">
              <Cpu className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight text-white">GENESIS</span>
              <span className="font-bold text-[9px] ml-1 text-cyan-400 border border-cyan-500/20 px-1 py-0.2 rounded bg-cyan-500/5">CONSOLE</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {displayedMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all relative group ${
                    isActive 
                      ? "bg-purple-600/10 text-purple-400 border-l-2 border-purple-500" 
                      : "text-neutral-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-purple-400" : "text-neutral-500 group-hover:text-white"}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Block & Logout */}
        <div className="p-4 border-t border-white/5 space-y-4">
          <div className="flex items-center space-x-3 bg-white/5 p-3 rounded-lg border border-white/5">
            <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <User className="w-4.5 h-4.5" />
            </div>
            <div className="truncate text-left">
              <div className="text-xs font-bold text-white truncate">{user.displayName}</div>
              <div className="text-[10px] text-neutral-500 truncate capitalize">{user.role} role</div>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Link</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Navigation */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#0b0b10] border-b border-white/5 w-full z-45">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <Cpu className="w-5 h-5 text-purple-400" />
          <span className="font-extrabold text-sm text-white">GENESIS AI</span>
        </Link>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={toggleTheme} 
            className="p-2 bg-white/5 border border-white/10 rounded-lg text-neutral-300 hover:text-white"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 bg-white/5 border border-white/10 rounded-lg text-neutral-300"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Overlay mask */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black z-40 md:hidden"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-64 bg-[#0b0b10] border-r border-white/5 p-6 z-50 flex flex-col justify-between md:hidden"
            >
              <div>
                <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <Cpu className="w-5 h-5 text-purple-400" />
                    <span className="font-extrabold text-sm text-white">GENESIS AI</span>
                  </div>
                  <button onClick={() => setIsSidebarOpen(false)} className="text-neutral-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-1">
                  {displayedMenuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        href={item.path}
                        onClick={() => setIsSidebarOpen(false)}
                        className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold ${
                          isActive ? "bg-purple-600/10 text-purple-400" : "text-neutral-400 hover:bg-white/5"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex items-center space-x-2.5 bg-white/5 p-2.5 rounded-lg">
                  <User className="w-4 h-4 text-purple-400" />
                  <div className="truncate text-left text-xs">
                    <div className="font-bold text-white truncate">{user.displayName}</div>
                    <div className="text-[10px] text-neutral-500 capitalize">{user.role}</div>
                  </div>
                </div>

                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Panel Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Header - Desktop Topbar */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 border-b border-white/5 bg-[#09090d]/65 sticky top-0 backdrop-blur-md z-30 select-none">
          {/* Header Info */}
          <div className="flex items-center space-x-3">
            <span className="text-sm font-semibold text-neutral-300">Security Clearance Level:</span>
            <span className="text-xs font-bold uppercase tracking-wider bg-purple-500/10 text-purple-300 border border-purple-500/20 px-2 py-0.5 rounded">
              Level {user.role === "admin" ? "3 (SYS-ADMIN)" : user.role === "operator" ? "2 (OPERATOR)" : "1 (VIEWER)"}
            </span>
          </div>

          <div className="flex items-center space-x-6">
            {/* Live Indicator */}
            <div className="flex items-center space-x-2 bg-white/5 px-3 py-1 rounded-full border border-white/5 text-[10px] font-mono tracking-wider">
              <span className={`w-1.5 h-1.5 rounded-full ${isMockMode ? "bg-amber-400 animate-pulse" : "bg-emerald-400 animate-pulse"}`} />
              <span className={isMockMode ? "text-amber-400" : "text-emerald-400"}>
                {isMockMode ? "DEMO-MODE (LOCAL)" : "PROD-CLOUD CONNECTION"}
              </span>
            </div>

            {/* Light/Dark Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border border-white/5 transition-colors cursor-pointer"
              title="Toggle theme mode"
            >
              {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-purple-400" />}
            </button>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <main className="flex-1 p-6 md:p-8 flex flex-col relative">
          {children}
        </main>
      </div>

    </div>
  );
}
