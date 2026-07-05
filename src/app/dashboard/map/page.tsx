"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { 
  Search, 
  SlidersHorizontal, 
  MapPin, 
  Building2, 
  ShieldAlert,
  Tent,
  AlertTriangle,
  Compass,
  Info
} from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { dbService, Incident } from "@/services/firebase";

// Dynamically import the Leaflet map with SSR disabled to prevent window crashes
const LiveMap = dynamic(() => import("@/components/map/LiveMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#0d0d12] border border-white/5 rounded-xl flex flex-col items-center justify-center space-y-3 min-h-[450px]">
      <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
      <span className="text-xs font-mono text-neutral-500">Loading Geospatial Layout...</span>
    </div>
  )
});

export default function SmartCityMapPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    incidents: true,
    hospitals: true,
    police: true,
    shelters: true,
    riskZones: true
  });

  // Incident Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newIncidentCoords, setNewIncidentCoords] = useState<[number, number] | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newSeverity, setNewSeverity] = useState<"critical" | "high" | "medium" | "low">("medium");
  const [newDept, setNewDept] = useState<"traffic" | "health" | "security" | "infrastructure">("infrastructure");
  
  // Rescue Routing state
  const [activeRoute, setActiveRoute] = useState<{ start: [number, number], end: [number, number], color: string } | null>(null);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>("");
  const [selectedStation, setSelectedStation] = useState<string>("Saint Jude Medical Center");

  useEffect(() => {
    // Subscribe to incidents database
    const unsub = dbService.subscribeCollection<Incident>("incidents", (data) => {
      setIncidents(data);
    });
    return () => unsub();
  }, []);

  const handleMapClick = (lat: number, lng: number) => {
    setNewIncidentCoords([lat, lng]);
    setIsAddModalOpen(true);
  };

  const handleCreateIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIncidentCoords || !newTitle) return;

    const newInc = {
      title: newTitle,
      description: newDesc,
      severity: newSeverity,
      department: newDept,
      coordinates: newIncidentCoords,
      status: "active"
    };

    await dbService.addItem("incidents", newInc);
    
    // Add corresponding alert to alerts list automatically
    const newAlert = {
      title: `Telemetry Spike: ${newTitle}`,
      description: newDesc,
      severity: newSeverity,
      department: newDept,
      action: `Establish priority path coordinates and dispatch personnel.`,
      status: "active"
    };
    await dbService.addItem("alerts", newAlert);

    // Reset Form
    setNewTitle("");
    setNewDesc("");
    setNewSeverity("medium");
    setIsAddModalOpen(false);
    setNewIncidentCoords(null);
  };

  // Dispatch routing simulator
  const handleCalculateRoute = () => {
    if (!selectedIncidentId) return;
    const targetInc = incidents.find(i => i.id === selectedIncidentId);
    if (!targetInc) return;

    // Fixed coords for dispatcher stations
    const stationCoords: Record<string, [number, number]> = {
      "Saint Jude Medical Center": [37.7830, -122.4220],
      "City General Hospital": [37.7610, -122.4110],
      "Northern Division Station": [37.7920, -122.4080],
      "Southern Triage Division": [37.7700, -122.4030]
    };

    const start = stationCoords[selectedStation];
    const end = targetInc.coordinates;

    if (start && end) {
      setActiveRoute({
        start,
        end,
        color: selectedStation.includes("Hospital") || selectedStation.includes("Medical") ? "#06b6d4" : "#8b5cf6"
      });
    }
  };

  return (
    <div className="space-y-6 flex-1 flex flex-col min-h-0">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">Smart City Geo-Sensing</h1>
          <p className="text-neutral-400 text-xs md:text-sm mt-1">Sensing overlay displaying hospitals, command shelters, hazard regions, and incident dispatches.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* Left Side: Filter Panels */}
        <div className="lg:col-span-3 space-y-6 flex flex-col">
          
          {/* Geolocation Search */}
          <GlassCard className="border border-white/5 p-4">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-neutral-500">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Search station or incident..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500/50"
              />
            </div>
          </GlassCard>

          {/* Map Overlay Filter Checkboxes */}
          <GlassCard className="border border-white/5 p-5 space-y-4">
            <div className="flex items-center space-x-2 border-b border-white/5 pb-2">
              <SlidersHorizontal className="w-4 h-4 text-purple-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Map Layer Filters</h3>
            </div>
            
            <div className="space-y-3">
              <label className="flex items-center space-x-2.5 text-xs text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.incidents}
                  onChange={(e) => setFilters(prev => ({ ...prev, incidents: e.target.checked }))}
                  className="rounded bg-neutral-900 border-white/10 text-purple-500 focus:ring-0"
                />
                <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span>Active Incidents</span>
              </label>

              <label className="flex items-center space-x-2.5 text-xs text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.hospitals}
                  onChange={(e) => setFilters(prev => ({ ...prev, hospitals: e.target.checked }))}
                  className="rounded bg-neutral-900 border-white/10 text-purple-500 focus:ring-0"
                />
                <Building2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Hospitals</span>
              </label>

              <label className="flex items-center space-x-2.5 text-xs text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.police}
                  onChange={(e) => setFilters(prev => ({ ...prev, police: e.target.checked }))}
                  className="rounded bg-neutral-900 border-white/10 text-purple-500 focus:ring-0"
                />
                <ShieldAlert className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>Police Stations</span>
              </label>

              <label className="flex items-center space-x-2.5 text-xs text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.shelters}
                  onChange={(e) => setFilters(prev => ({ ...prev, shelters: e.target.checked }))}
                  className="rounded bg-neutral-900 border-white/10 text-purple-500 focus:ring-0"
                />
                <Tent className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Refuge Shelters</span>
              </label>

              <label className="flex items-center space-x-2.5 text-xs text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.riskZones}
                  onChange={(e) => setFilters(prev => ({ ...prev, riskZones: e.target.checked }))}
                  className="rounded bg-neutral-900 border-white/10 text-purple-500 focus:ring-0"
                />
                <Compass className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Hazard Risk Zones</span>
              </label>
            </div>
          </GlassCard>

          {/* Rescue Routing dispatch controls */}
          <GlassCard className="border border-white/5 p-5 space-y-4">
            <div className="flex items-center space-x-2 border-b border-white/5 pb-2">
              <Compass className="w-4 h-4 text-purple-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Rescue Path Router</h3>
            </div>

            <div className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[10px] text-neutral-500 font-bold uppercase">Select Target Incident</label>
                <select
                  value={selectedIncidentId}
                  onChange={(e) => setSelectedIncidentId(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/10 rounded-lg py-2 px-2.5 text-xs text-white"
                >
                  <option value="">-- Choose Incident --</option>
                  {incidents.map((inc) => (
                    <option key={inc.id} value={inc.id}>
                      [{inc.severity.toUpperCase()}] {inc.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-neutral-500 font-bold uppercase">Select Dispatcher Unit</label>
                <select
                  value={selectedStation}
                  onChange={(e) => setSelectedStation(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/10 rounded-lg py-2 px-2.5 text-xs text-white"
                >
                  <option value="Saint Jude Medical Center">🏥 Saint Jude Med Center (ICU)</option>
                  <option value="City General Hospital">🏥 City General Hospital</option>
                  <option value="Northern Division Station">🛡️ Northern Police Station</option>
                  <option value="Southern Triage Division">🛡️ Southern Police Station</option>
                </select>
              </div>

              <button
                onClick={handleCalculateRoute}
                disabled={!selectedIncidentId}
                className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs py-2 px-4 rounded-lg cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Simulate Rescue Route
              </button>

              {activeRoute && (
                <button
                  onClick={() => setActiveRoute(null)}
                  className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-neutral-300 font-bold text-xs py-1.5 px-4 rounded-lg cursor-pointer transition-colors"
                >
                  Clear Route Polyline
                </button>
              )}
            </div>
          </GlassCard>

          {/* Quick instructions indicator */}
          <div className="text-[10px] text-neutral-500 bg-white/[0.01] border border-white/5 p-3 rounded-lg flex items-start space-x-2">
            <Info className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
            <span>Click any coordinate directly on the map surface to pin and register a new incident live!</span>
          </div>

        </div>

        {/* Right Side: Map Canvas */}
        <div className="lg:col-span-9 flex flex-col relative h-[500px] lg:h-auto min-h-[450px]">
          
          <LiveMap
            incidents={incidents}
            filters={filters}
            searchQuery={searchQuery}
            onAddIncidentClick={handleMapClick}
            activeIncidentRoute={activeRoute}
          />

          {/* Add Incident Dialog Modal */}
          {isAddModalOpen && newIncidentCoords && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <GlassCard className="w-full max-w-sm border border-white/10 bg-[#0d0d12]/95 p-6 space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-purple-400" />
                    <span>Pin New City Incident</span>
                  </h3>
                  <p className="text-[10px] text-neutral-500 mt-1">Coords: {newIncidentCoords[0].toFixed(4)}, {newIncidentCoords[1].toFixed(4)}</p>
                </div>

                <form onSubmit={handleCreateIncident} className="space-y-3.5 text-xs text-left">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-neutral-400">Incident Heading</label>
                    <input
                      type="text"
                      placeholder="e.g. Water Line Rupture"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-purple-500/50"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-neutral-400">Details Description</label>
                    <textarea
                      placeholder="Input diagnostic notes..."
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      rows={2}
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-purple-500/50 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-neutral-400">Severity Rating</label>
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
                      <label className="text-[10px] font-semibold text-neutral-400">Department</label>
                      <select
                        value={newDept}
                        onChange={(e) => setNewDept(e.target.value as "traffic" | "health" | "security" | "infrastructure")}
                        className="w-full bg-neutral-900 border border-white/10 rounded-lg p-1.5 text-white"
                      >
                        <option value="infrastructure">Infrastructure</option>
                        <option value="traffic">Traffic</option>
                        <option value="security">Security</option>
                        <option value="health">Health Division</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddModalOpen(false);
                        setNewIncidentCoords(null);
                      }}
                      className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 text-neutral-300 py-2 rounded-lg font-semibold transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-purple-600 hover:bg-purple-500 text-white py-2 rounded-lg font-bold transition-colors cursor-pointer"
                    >
                      Dispatch Warning
                    </button>
                  </div>
                </form>
              </GlassCard>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
