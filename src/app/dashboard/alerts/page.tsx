"use client";

import React, { useState, useEffect } from "react";
import { 
  BellRing, 
  CheckCircle2, 
  FileCheck2, 
  Clock, 
  Trash2
} from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { dbService, Alert } from "@/services/firebase";

export default function IncidentAlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Manual Alert dispatch form state
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newSeverity, setNewSeverity] = useState<"critical" | "high" | "medium" | "low">("medium");
  const [newDept, setNewDept] = useState("health");
  const [newAction, setNewAction] = useState("");

  // Sub to database alerts collection
  useEffect(() => {
    const unsub = dbService.subscribeCollection<Alert>("alerts", (data) => {
      setAlerts(data);
    });
    return () => unsub();
  }, []);

  const handleAcknowledgeAlert = async (id: string) => {
    await dbService.updateItem("alerts", id, { status: "acknowledged" });
  };

  const handleResolveAlert = async (id: string) => {
    await dbService.updateItem("alerts", id, { status: "resolved" });
  };

  const handleDeleteAlert = async (id: string) => {
    await dbService.deleteItem("alerts", id);
  };

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newAction) return;

    const alertDoc = {
      title: newTitle,
      description: newDesc,
      severity: newSeverity,
      department: newDept,
      action: newAction,
      status: "active"
    };

    await dbService.addItem("alerts", alertDoc);

    // Reset Form fields
    setNewTitle("");
    setNewDesc("");
    setNewAction("");
    setNewSeverity("medium");
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesSev = severityFilter === "all" || alert.severity === severityFilter;
    const matchesStat = statusFilter === "all" || alert.status === statusFilter;
    return matchesSev && matchesStat;
  });

  const severityBadges = {
    critical: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    high: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    medium: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    low: "bg-neutral-800 text-neutral-400 border-white/5"
  };

  return (
    <div className="space-y-6 flex-1">
      {/* Page Heading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            Incident Alerts Center
          </h1>
          <p className="text-neutral-400 text-xs md:text-sm mt-1">Sensing and auditing emergency broadcasts across regional operations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Filter Control & Alert Form */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Filtering */}
          <GlassCard className="border border-white/5 p-5 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/5 pb-2">Filter Controls</h3>
            
            <div className="space-y-3.5 text-xs text-left">
              <div className="space-y-1">
                <label className="text-[10px] text-neutral-500 font-bold uppercase">Severity Clearence</label>
                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/10 rounded-lg py-2 px-2.5 text-white"
                >
                  <option value="all">All Severities</option>
                  <option value="critical">Critical Only</option>
                  <option value="high">High & Above</option>
                  <option value="medium">Medium & Above</option>
                  <option value="low">Low Only</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-neutral-500 font-bold uppercase">Resolution Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/10 rounded-lg py-2 px-2.5 text-white"
                >
                  <option value="all">All States</option>
                  <option value="active">Active Warnings</option>
                  <option value="acknowledged">Acknowledged</option>
                  <option value="resolved">Resolved Logs</option>
                </select>
              </div>
            </div>
          </GlassCard>

          {/* Alert Dispatch form */}
          <GlassCard className="border border-white/5 p-5 space-y-4">
            <div className="flex items-center space-x-2 border-b border-white/5 pb-2">
              <BellRing className="w-4 h-4 text-purple-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Manual Dispatch Alert</h3>
            </div>

            <form onSubmit={handleCreateAlert} className="space-y-3 text-xs text-left">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-neutral-400">Alert Title</label>
                <input
                  type="text"
                  placeholder="e.g. Main Reservoir Seepage"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-purple-500/50"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-neutral-400">Description</label>
                <textarea
                  placeholder="Input telemetry detail details..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  rows={2}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-purple-500/50 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-neutral-400">Severity</label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value as "critical" | "high" | "medium" | "low")}
                    className="w-full bg-neutral-900 border border-white/10 rounded-lg p-1.5 text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-neutral-400">Division</label>
                  <select
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full bg-neutral-900 border border-white/10 rounded-lg p-1.5 text-white"
                  >
                    <option value="health">Health</option>
                    <option value="energy">Energy Grid</option>
                    <option value="security">Security</option>
                    <option value="infrastructure">Infrastructure</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-neutral-400">Recommended Action Plan</label>
                <input
                  type="text"
                  placeholder="e.g. Deploy mobile sandbag lines..."
                  value={newAction}
                  onChange={(e) => setNewAction(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-purple-500/50"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs py-2 rounded-lg cursor-pointer transition-colors mt-2"
              >
                Broadcast Alert Warning
              </button>
            </form>
          </GlassCard>

        </div>

        {/* Right Side: Active Broadcast List */}
        <div className="lg:col-span-8 space-y-4 max-h-[700px] overflow-y-auto pr-1">
          {filteredAlerts.length === 0 ? (
            <div className="border border-white/5 p-12 rounded-xl text-center text-neutral-500 glass">
              <CheckCircle2 className="w-10 h-10 mx-auto mb-3 text-emerald-500/30" />
              <p className="text-sm font-semibold">No alerts matched the search constraints.</p>
              <p className="text-xs mt-1">Try broadening the filters or dispatch a manual warning.</p>
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              const isCritical = alert.severity === "critical";
              const isHigh = alert.severity === "high";
              const badgeClass = severityBadges[alert.severity as keyof typeof severityBadges] || severityBadges.low;
              
              return (
                <GlassCard 
                  key={alert.id}
                  className={`border border-white/5 flex flex-col md:flex-row justify-between text-left p-5 gap-4 relative overflow-hidden`}
                >
                  {/* Left Edge Accent strip */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                    isCritical ? "bg-rose-500" : isHigh ? "bg-amber-500" : "bg-cyan-500"
                  }`} />

                  <div className="space-y-3 flex-1 pl-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[9px] border px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider ${badgeClass}`}>
                        {alert.severity}
                      </span>
                      <span className="text-[10px] text-neutral-500 font-mono capitalize">
                        {alert.department} Department
                      </span>
                      <span className="text-[10px] text-neutral-500 font-mono flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(alert.timestamp).toLocaleDateString()} {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white leading-tight">{alert.title}</h3>
                    <p className="text-xs text-neutral-400 leading-relaxed">{alert.description}</p>
                    
                    <div className="bg-black/35 rounded border border-white/5 p-3 text-xs">
                      <span className="text-[10px] text-purple-400 font-bold uppercase block mb-1">Recommended Action</span>
                      <span className="text-neutral-300 font-medium">{alert.action}</span>
                    </div>
                  </div>

                  {/* Actions column */}
                  <div className="flex md:flex-col justify-end gap-2 md:w-36 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 md:border-l border-white/5 md:pl-4">
                    {alert.status === "active" && (
                      <button
                        onClick={() => handleAcknowledgeAlert(alert.id)}
                        className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-[10px] py-2 px-3 rounded-lg cursor-pointer transition-colors text-center"
                      >
                        Acknowledge
                      </button>
                    )}
                    {alert.status !== "resolved" && (
                      <button
                        onClick={() => handleResolveAlert(alert.id)}
                        className="flex-1 bg-purple-600/20 border border-purple-500/20 hover:bg-purple-600 text-white font-bold text-[10px] py-2 px-3 rounded-lg cursor-pointer transition-colors text-center"
                      >
                        Mark Resolved
                      </button>
                    )}
                    {alert.status === "resolved" && (
                      <div className="flex-1 flex items-center justify-center space-x-1 text-[10px] font-bold text-emerald-400 py-2">
                        <FileCheck2 className="w-4 h-4" />
                        <span>Closed Log</span>
                      </div>
                    )}
                    <button
                      onClick={() => handleDeleteAlert(alert.id)}
                      className="p-2 border border-white/5 hover:border-rose-500/30 hover:bg-rose-500/10 text-neutral-500 hover:text-rose-400 rounded-lg cursor-pointer transition-colors flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </GlassCard>
              );
            })
          )}
        </div>

      </div>

    </div>
  );
}
