"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Users, 
  Trash2, 
  RefreshCw, 
  AlertOctagon,
  Database
} from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { authService, UserProfile } from "@/services/firebase";

export default function AdminPanelPage() {
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchUsersInner = () => {
      if (typeof window === "undefined") return;
      try {
        const users = JSON.parse(localStorage.getItem("genesis_users") || "{}");
        setUsersList(Object.values(users));
      } catch (e) {
        console.error(e);
      }
    };

    const user = authService.getCurrentUser();
    if (user && user.role !== "admin") {
      router.push("/dashboard");
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentUser(user);
    }
    fetchUsersInner();
  }, [router]);

  const fetchUsers = () => {
    if (typeof window === "undefined") return;
    // Get users from localStorage mock database
    try {
      const users = JSON.parse(localStorage.getItem("genesis_users") || "{}");
      setUsersList(Object.values(users));
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateRole = (uid: string, newRole: "admin" | "operator" | "member") => {
    if (uid === currentUser?.uid) {
      alert("You cannot adjust your own clearance status.");
      return;
    }
    if (typeof window === "undefined") return;

    try {
      const users = JSON.parse(localStorage.getItem("genesis_users") || "{}");
      if (users[uid]) {
        users[uid].role = newRole;
        localStorage.setItem("genesis_users", JSON.stringify(users));
        fetchUsers();
        // Fire event to sync in layout
        window.dispatchEvent(new Event("genesis-auth-changed"));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteUser = (uid: string) => {
    if (uid === currentUser?.uid) {
      alert("You cannot delete your own profile.");
      return;
    }
    if (typeof window === "undefined") return;

    if (confirm("Are you sure you want to revoke this user's profile access?")) {
      try {
        const users = JSON.parse(localStorage.getItem("genesis_users") || "{}");
        delete users[uid];
        localStorage.setItem("genesis_users", JSON.stringify(users));
        fetchUsers();
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Seeding tools
  const handleClearDatabase = async () => {
    if (confirm("This will erase all active alerts and incidents. Proceed?")) {
      if (typeof window !== "undefined") {
        localStorage.setItem("genesis_alerts", "[]");
        localStorage.setItem("genesis_incidents", "[]");
        window.dispatchEvent(new Event("genesis-db-alerts-updated"));
        window.dispatchEvent(new Event("genesis-db-incidents-updated"));
        alert("Alerts & Incidents tables flushed.");
      }
    }
  };

  const handleRestoreDefaults = async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("genesis_alerts");
      localStorage.removeItem("genesis_incidents");
      window.location.reload(); // Quick refresh to trigger seeds
    }
  };

  return (
    <div className="space-y-6 flex-1">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            System Administration
          </h1>
          <p className="text-neutral-400 text-xs md:text-sm mt-1">Manage clearance levels, access roles, and database seed resets.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* User list management */}
        <div className="lg:col-span-8 space-y-6">
          <GlassCard className="border border-white/5 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Clearance Profiles</h3>
              </div>
              <button 
                onClick={fetchUsers}
                className="p-1.5 hover:bg-white/5 text-neutral-400 hover:text-white rounded transition-colors cursor-pointer"
                title="Refresh listings"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-neutral-500 font-mono text-[10px] uppercase">
                    <th className="py-2.5">User Profile</th>
                    <th className="py-2.5">Email Link</th>
                    <th className="py-2.5">Clearance Role</th>
                    <th className="py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {usersList.map((usr) => (
                    <tr key={usr.uid} className="hover:bg-white/[0.01] transition-colors">
                      <td className="py-3 font-bold text-white flex items-center space-x-2">
                        <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] text-purple-400 font-bold uppercase">
                          {usr.displayName?.substring(0, 2)}
                        </div>
                        <span>{usr.displayName}</span>
                      </td>
                      <td className="py-3 text-neutral-400 font-mono">{usr.email}</td>
                      <td className="py-3">
                        <select
                          value={usr.role}
                          onChange={(e) => handleUpdateRole(usr.uid, e.target.value as "admin" | "operator" | "member")}
                          className="bg-neutral-900 border border-white/10 rounded px-2 py-1 text-xs text-purple-300 font-semibold focus:outline-none"
                          disabled={usr.uid === currentUser?.uid}
                        >
                          <option value="member">Member</option>
                          <option value="operator">Operator</option>
                          <option value="admin">Administrator</option>
                        </select>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => handleDeleteUser(usr.uid)}
                          disabled={usr.uid === currentUser?.uid}
                          className="p-1.5 border border-white/5 hover:border-rose-500/30 hover:bg-rose-500/10 text-neutral-500 hover:text-rose-400 rounded cursor-pointer transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Revoke clearance profile"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>

        {/* Database utilities & debuggers */}
        <div className="lg:col-span-4 space-y-6">
          <GlassCard className="border border-white/5 p-6 space-y-4">
            <div className="flex items-center space-x-2 border-b border-white/5 pb-2">
              <Database className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Database Operations</h3>
            </div>

            <div className="space-y-3.5 text-xs text-left">
              <div className="p-3 bg-rose-500/5 border border-rose-500/20 rounded-lg space-y-2.5">
                <div className="flex items-center space-x-2 text-rose-400 font-bold">
                  <AlertOctagon className="w-4 h-4" />
                  <span>Destructive Resets</span>
                </div>
                <p className="text-[10px] text-neutral-400 leading-relaxed">
                  Flushing tables clears telemetry maps, simulator graphs, and incident lists. Active clearances will remain unchanged.
                </p>
                <div className="flex space-x-2 pt-1">
                  <button
                    onClick={handleClearDatabase}
                    className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-bold py-2 rounded text-[10px] transition-colors cursor-pointer"
                  >
                    Clear DB Logs
                  </button>
                  <button
                    onClick={handleRestoreDefaults}
                    className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 text-neutral-300 font-bold py-2 rounded text-[10px] transition-colors cursor-pointer"
                  >
                    Re-Seed Seeds
                  </button>
                </div>
              </div>

              <div className="p-3 bg-white/[0.01] border border-white/5 rounded-lg space-y-2 font-mono text-[10px]">
                <h4 className="font-bold text-white">Platform Health</h4>
                <div className="flex items-center justify-between">
                  <span>Registered Accounts:</span>
                  <span className="text-white font-bold">{usersList.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Database Mode:</span>
                  <span className="text-purple-400 font-bold">MOCK DATABASE</span>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

      </div>
    </div>
  );
}
