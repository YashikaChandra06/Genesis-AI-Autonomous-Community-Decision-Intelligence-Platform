"use client";

import React, { useState, useEffect } from "react";
import { 
  Activity, 
  AlertTriangle, 
  CloudSun, 
  Wind, 
  Building2, 
  Zap, 
  Droplet,
  Brain,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import MetricCard from "@/components/ui/MetricCard";
import GlassCard from "@/components/ui/GlassCard";
import { dbService, Alert, Incident } from "@/services/firebase";
import { 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from "recharts";

// Mock constant telemetry data for the charts
const CHART_ENERGY_DATA = [
  { hour: "00:00", demand: 42, supply: 45 },
  { hour: "04:00", demand: 38, supply: 45 },
  { hour: "08:00", demand: 68, supply: 70 },
  { hour: "12:00", demand: 85, supply: 90 },
  { hour: "16:00", demand: 94, supply: 95 },
  { hour: "20:00", demand: 75, supply: 80 },
  { hour: "23:59", demand: 50, supply: 55 },
];

const CHART_POLLUTION_DATA = [
  { day: "Mon", PM25: 42, Ozone: 35 },
  { day: "Tue", PM25: 48, Ozone: 38 },
  { day: "Wed", PM25: 64, Ozone: 45 },
  { day: "Thu", PM25: 110, Ozone: 78 }, // Spike
  { day: "Fri", PM25: 154, Ozone: 88 }, // Peak
  { day: "Sat", PM25: 85, Ozone: 52 },
  { day: "Sun", PM25: 45, Ozone: 30 },
];

const CHART_HOSPITAL_DATA = [
  { name: "AIIMS ICU", occupancy: 91, available: 9 },
  { name: "RML Hospital", occupancy: 62, available: 38 },
  { name: "Safdarjung Clinic", occupancy: 45, available: 55 },
];

export default function DashboardOverviewPage() {
  const [mounted, setMounted] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  
  // Hydration safety check
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Subscribe to DB updates
  useEffect(() => {
    const unsubAlerts = dbService.subscribeCollection<Alert>("alerts", (data) => {
      setAlerts(data);
    });
    const unsubIncidents = dbService.subscribeCollection<Incident>("incidents", (data) => {
      setIncidents(data);
    });
    return () => {
      unsubAlerts();
      unsubIncidents();
    };
  }, []);

  // Compute stats based on active databases
  const activeAlertsCount = alerts.filter(a => a.status === "active").length;
  const criticalAlertsCount = alerts.filter(a => a.severity === "critical" && a.status === "active").length;
  
  // Dynamic AI recommendation based on alerts status
  const getAIRecommendation = () => {
    if (criticalAlertsCount > 0) {
      return {
        title: "Deploy Dynamic Flood Barrier Network & Divert Traffic",
        desc: "Severe River Sector A retention warnings detected. Pre-position AMB-102 ambulance squads near Sector 4 transit hub to minimize delay responses.",
        priority: "CRITICAL ACTION REQUIREMENT"
      };
    }
    if (activeAlertsCount > 0) {
      return {
        title: "Balance Grid Load Substation 12B & Shift Thermostats",
        desc: "Energy grid demand is at 94%. Trigger load conservation flags to smart residential systems (+1.5°C threshold adjustments).",
        priority: "HIGH PRIORITY ACTION"
      };
    }
    return {
      title: "Optimized Telemetry Configuration",
      desc: "All urban systems are reporting parameters within safe margins. Pre-deploying traffic priority timers along the primary transit lanes.",
      priority: "ROUTINE SYSTEM LOG"
    };
  };

  const aiRec = getAIRecommendation();

  return (
    <div className="space-y-8 flex-1">
      {/* Welcome Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            System Operations Overview
          </h1>
          <p className="text-neutral-400 text-xs md:text-sm mt-1">Real-time municipality sensing feed & predictive emergency analytics.</p>
        </div>
        <div className="flex items-center space-x-2 text-xs text-neutral-400 bg-white/5 border border-white/10 px-3.5 py-2 rounded-lg">
          <Clock className="w-4 h-4 text-purple-400" />
          <span>Last telemetric sweep: Just now</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Community Health Score"
          value={criticalAlertsCount > 0 ? "76%" : "84%"}
          change={criticalAlertsCount > 0 ? -8 : 1.2}
          changeLabel="vs yesterday"
          icon={<Activity className="w-5 h-5" />}
          color={criticalAlertsCount > 0 ? "red" : "purple"}
          delay={0.05}
        />
        <MetricCard
          title="Active Incident Flags"
          value={incidents.length}
          change={incidents.filter(i => i.status === "active").length}
          changeLabel="currently unresolved"
          icon={<AlertTriangle className="w-5 h-5" />}
          color={incidents.length > 3 ? "red" : "yellow"}
          delay={0.1}
        />
        <MetricCard
          title="Regional Air Quality (AQI)"
          value="154"
          change={24}
          changeLabel="unhealthy PM2.5 loop"
          icon={<Wind className="w-5 h-5" />}
          color="yellow"
          delay={0.15}
        />
        <MetricCard
          title="Hospital Occupancy Rate"
          value="76%"
          change={5.2}
          changeLabel="critical ICU levels"
          icon={<Building2 className="w-5 h-5" />}
          color="cyan"
          delay={0.2}
        />
      </div>

      {/* Secondary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-center space-x-4 bg-white/[0.02] border border-white/5 p-4 rounded-xl">
          <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-neutral-500 font-semibold uppercase">Energy Grid Load</div>
            <div className="text-lg font-bold text-white">94% Saturation</div>
          </div>
        </div>

        <div className="flex items-center space-x-4 bg-white/[0.02] border border-white/5 p-4 rounded-xl">
          <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Droplet className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-neutral-500 font-semibold uppercase">Reservoir Supply</div>
            <div className="text-lg font-bold text-white">88% Volume Capacity</div>
          </div>
        </div>

        <div className="flex items-center space-x-4 bg-white/[0.02] border border-white/5 p-4 rounded-xl">
          <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <CloudSun className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-neutral-500 font-semibold uppercase">Municipal Forecast</div>
            <div className="text-lg font-bold text-white">19°C (Scattered Showers)</div>
          </div>
        </div>
      </div>

      {/* Main dashboard widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Graphs */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Energy usage graph */}
          <GlassCard className="border border-white/5" glow>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-white">Grid Demand & Supply Curve</h3>
                <p className="text-[11px] text-neutral-400">Hourly kilowatt loading forecasts across Substation 12B.</p>
              </div>
              <span className="text-[10px] text-purple-400 font-bold border border-purple-500/25 px-2 py-0.5 rounded">Real-Time MW</span>
            </div>

            <div className="h-64 w-full">
              {mounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={CHART_ENERGY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorSupply" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="hour" stroke="#52525b" fontSize={10} tickLine={false} />
                    <YAxis stroke="#52525b" fontSize={10} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: "#0b0b10", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", fontSize: "11px" }} />
                    <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                    <Area type="monotone" dataKey="demand" name="Power Demand (MW)" stroke="#7c3aed" fillOpacity={1} fill="url(#colorDemand)" strokeWidth={2} />
                    <Area type="monotone" dataKey="supply" name="Power Grid Supply (MW)" stroke="#06b6d4" fillOpacity={1} fill="url(#colorSupply)" strokeWidth={1.5} strokeDasharray="3 3" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </GlassCard>

          {/* Side by side mini charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pollution Spike chart */}
            <GlassCard className="border border-white/5">
              <div className="mb-4">
                <h4 className="text-sm font-bold text-white">AQI Emission Spikes</h4>
                <p className="text-[11px] text-neutral-400">Weekly loop showing PM2.5 vs Ozone levels.</p>
              </div>

              <div className="h-48 w-full">
                {mounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={CHART_POLLUTION_DATA} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                      <XAxis dataKey="day" stroke="#52525b" fontSize={9} tickLine={false} />
                      <YAxis stroke="#52525b" fontSize={9} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: "#0b0b10", border: "1px solid rgba(255,255,255,0.08)", fontSize: "10px" }} />
                      <Line type="monotone" dataKey="PM25" name="PM 2.5 Index" stroke="#eab308" strokeWidth={2} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="Ozone" name="Ozone" stroke="#06b6d4" strokeWidth={1.5} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </GlassCard>

            {/* Hospital occupancies */}
            <GlassCard className="border border-white/5">
              <div className="mb-4">
                <h4 className="text-sm font-bold text-white">Hospital ICU Thresholds</h4>
                <p className="text-[11px] text-neutral-400">Active percentage occupancies vs remaining safety buffers.</p>
              </div>

              <div className="h-48 w-full">
                {mounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={CHART_HOSPITAL_DATA} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                      <XAxis dataKey="name" stroke="#52525b" fontSize={9} tickLine={false} />
                      <YAxis stroke="#52525b" fontSize={9} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: "#0b0b10", border: "1px solid rgba(255,255,255,0.08)", fontSize: "10px" }} />
                      <Bar dataKey="occupancy" name="ICU Bed Occupancy %" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </GlassCard>
          </div>

        </div>

        {/* Right Side: AI Panel & Real-time Alerts */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* AI Decision Advisory */}
          <GlassCard className="border border-purple-500/20 bg-purple-500/5 relative overflow-hidden" glow>
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center space-x-2.5 mb-4">
              <div className="p-1.5 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Brain className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <span className="text-[10px] text-purple-400 font-extrabold uppercase tracking-widest block">AI Decision Engine</span>
                <h3 className="text-sm font-extrabold text-white">Predictive Recommendation</h3>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-black/35 rounded-lg border border-white/5 p-4 space-y-2">
                <span className="text-[9px] bg-rose-500/10 text-rose-400 border border-rose-500/35 px-2 py-0.5 rounded font-mono font-bold uppercase">
                  {aiRec.priority}
                </span>
                <h4 className="text-xs font-bold text-white leading-tight">{aiRec.title}</h4>
                <p className="text-[11px] text-neutral-400 leading-relaxed">{aiRec.desc}</p>
              </div>

              <div className="text-[10px] text-neutral-500 leading-normal flex items-center space-x-1 font-mono">
                <Clock className="w-3 h-3 text-purple-400" />
                <span>Simulated deployment response estimate: &lt; 4m 30s</span>
              </div>
            </div>
          </GlassCard>

          {/* Active Incident Alert Feeds */}
          <GlassCard className="border border-white/5">
            <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">Live Incident Alerts</h3>
                <p className="text-[10px] text-neutral-400">Chronological telemetry warnings.</p>
              </div>
              <span className="text-[10px] bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded font-mono font-bold">
                {alerts.filter(a => a.status === "active").length} ACTIVE
              </span>
            </div>

            <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
              {alerts.length === 0 ? (
                <div className="text-center py-6 text-xs text-neutral-500">
                  <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500/30" />
                  <span>No active warnings reporting.</span>
                </div>
              ) : (
                alerts.map((alert) => {
                  const severityColors = {
                    critical: "border-rose-500/30 bg-rose-950/10 text-rose-400",
                    high: "border-amber-500/20 bg-amber-950/10 text-amber-400",
                    medium: "border-cyan-500/20 bg-cyan-950/10 text-cyan-400",
                    low: "border-neutral-500/20 bg-neutral-950/10 text-neutral-400"
                  };
                  const color = severityColors[alert.severity as keyof typeof severityColors] || severityColors.low;
                  
                  return (
                    <div 
                      key={alert.id} 
                      className={`p-3 rounded-lg border text-left text-xs space-y-1.5 transition-all hover:bg-white/[0.02] ${color}`}
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span className="truncate">{alert.title}</span>
                        <span className="text-[9px] uppercase font-mono ml-2 border border-current px-1 rounded shrink-0">
                          {alert.severity}
                        </span>
                      </div>
                      <p className="text-[10px] text-neutral-400 leading-relaxed truncate">{alert.description}</p>
                      
                      <div className="flex items-center justify-between text-[9px] text-neutral-500 font-mono">
                        <span className="capitalize">{alert.department} division</span>
                        <span>{new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </GlassCard>

          {/* Recent Decisions Log */}
          <GlassCard className="border border-white/5">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-white">Recent Decisions Log</h3>
              <p className="text-[10px] text-neutral-400">System actions acknowledged by security operators.</p>
            </div>

            <div className="space-y-3 font-mono text-[10px]">
              <div className="flex items-start space-x-2 border-b border-white/5 pb-2.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <div className="text-left text-neutral-300">
                  <div className="font-semibold text-white">Ambulances Dispatched (RML Hosp.)</div>
                  <div className="text-neutral-500">ICU Divert protocol activated at AIIMS Delhi.</div>
                </div>
              </div>
              <div className="flex items-start space-x-2 border-b border-white/5 pb-2.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <div className="text-left text-neutral-300">
                  <div className="font-semibold text-white">VPP Grid Battery Feed Activated</div>
                  <div className="text-neutral-500">Discharged 12MW to loop 3 to buffer max usage.</div>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                <div className="text-left text-neutral-300">
                  <div className="font-semibold text-white">Storm Warnings Issued (Sector A)</div>
                  <div className="text-neutral-500">Automated flood barrier positioning initiated.</div>
                </div>
              </div>
            </div>
          </GlassCard>

        </div>

      </div>
    </div>
  );
}
