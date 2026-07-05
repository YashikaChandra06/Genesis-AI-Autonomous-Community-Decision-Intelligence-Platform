"use client";

import React, { useState, useEffect } from "react";
import { ReactFlow, Background, Controls, Node, Edge } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { 
  Zap, 
  ShieldAlert, 
  Wrench, 
  Play,
  RotateCcw,
  Sparkles,
  Info
} from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";

// Definition of simulated scenario configurations
interface ScenarioConfig {
  name: string;
  type: string;
  riskScore: number;
  affectedPop: string;
  resources: string;
  color: "purple" | "cyan" | "green" | "red" | "yellow";
  actions: string[];
  nodes: Node[];
  edges: Edge[];
}

const SCENARIOS: Record<string, ScenarioConfig> = {
  rain: {
    name: "Heavy Rain (Storm)",
    type: "Storm",
    riskScore: 52,
    affectedPop: "15,000 residents",
    resources: "4 Triage Units, 2 Drainage Pumps",
    color: "cyan",
    actions: [
      "Deploy drainage cleanup crews to Sector A corridors.",
      "Dispatch warning alerts regarding potential road ponding.",
      "Monitor low-lying street grids."
    ],
    nodes: [
      { id: "1", position: { x: 50, y: 100 }, data: { label: "🌧️ Heavy Storm Front" }, style: { background: "#06b6d4", color: "#fff", border: "1px solid #0891b2" } },
      { id: "2", position: { x: 250, y: 50 }, data: { label: "💧 Sewer System Load (91%)" }, style: { background: "#18181b", color: "#a1a1aa", border: "1px solid #27272a" } },
      { id: "3", position: { x: 250, y: 150 }, data: { label: "🚗 Sector 3 Road Ponding" }, style: { background: "#18181b", color: "#a1a1aa", border: "1px solid #27272a" } },
      { id: "4", position: { x: 450, y: 100 }, data: { label: "⚠️ Slowed Traffic (Bypass Active)" }, style: { background: "#eab308", color: "#fff", border: "1px solid #ca8a04" } }
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2", animated: true },
      { id: "e1-3", source: "1", target: "3", animated: true },
      { id: "e2-4", source: "2", target: "4", animated: true },
      { id: "e3-4", source: "3", target: "4", animated: true }
    ]
  },
  flood: {
    name: "Flash Flooding",
    type: "Flood",
    riskScore: 87,
    affectedPop: "42,000 residents",
    resources: "10 Rescue Vehicles, 8 Boats, 3 Shelters",
    color: "red",
    actions: [
      "Order evacuation of the River Sector A low-lying basin.",
      "Deploy dynamic mobile barriers along River Road.",
      "Activate evac shelters at Downtown Refuge."
    ],
    nodes: [
      { id: "1", position: { x: 50, y: 120 }, data: { label: "🌊 River Sector A Breach" }, style: { background: "#ef4444", color: "#fff", border: "1px solid #b91c1c", boxShadow: "0 0 10px rgba(239, 68, 68, 0.4)" } },
      { id: "2", position: { x: 250, y: 40 }, data: { label: "⚡ Substation 12B Offline" }, style: { background: "#18181b", color: "#f87171", border: "1px solid #ef4444" } },
      { id: "3", position: { x: 250, y: 200 }, data: { label: "🚧 Road Grid Closed" }, style: { background: "#eab308", color: "#fff", border: "1px solid #ca8a04" } },
      { id: "4", position: { x: 480, y: 40 }, data: { label: "🏥 ICU Backup Power Active" }, style: { background: "#10b981", color: "#fff", border: "1px solid #059669" } },
      { id: "5", position: { x: 480, y: 200 }, data: { label: "🏕️ Shelter Evac Active" }, style: { background: "#06b6d4", color: "#fff", border: "1px solid #0891b2" } }
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2", animated: true },
      { id: "e1-3", source: "1", target: "3", animated: true },
      { id: "e2-4", source: "2", target: "4", animated: true },
      { id: "e3-5", source: "3", target: "5", animated: true }
    ]
  },
  power: {
    name: "Grid Substation Failure",
    type: "Utility failure",
    riskScore: 78,
    affectedPop: "65,000 residents",
    resources: "14 Generator Units, 5 Grid Repair Teams",
    color: "yellow",
    actions: [
      "Inquire reserve generators to feed critical health wards.",
      "Notify grid teams to bypass Section B.",
      "Send energy alert to smart thermostats (+1.5°C)."
    ],
    nodes: [
      { id: "1", position: { x: 50, y: 100 }, data: { label: "🔌 Substation Transformer Short" }, style: { background: "#eab308", color: "#fff", border: "1px solid #ca8a04" } },
      { id: "2", position: { x: 250, y: 40 }, data: { label: "🚦 Traffic Signals Inactive" }, style: { background: "#18181b", color: "#a1a1aa", border: "1px solid #27272a" } },
      { id: "3", position: { x: 250, y: 160 }, data: { label: "📶 Telecom Towers Offline" }, style: { background: "#18181b", color: "#a1a1aa", border: "1px solid #27272a" } },
      { id: "4", position: { x: 480, y: 100 }, data: { label: "🚨 Gridlock Congestion" }, style: { background: "#ef4444", color: "#fff", border: "1px solid #b91c1c" } }
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2", animated: true },
      { id: "e1-3", source: "1", target: "3", animated: true },
      { id: "e2-4", source: "2", target: "4", animated: true },
      { id: "e3-4", source: "3", target: "4", animated: true }
    ]
  },
  outbreak: {
    name: "Pathogen Outbreak",
    type: "Health Crisis",
    riskScore: 68,
    affectedPop: "8,000 exposed",
    resources: "12 Specialists, 5 Sanitizers, 2 Isolation Wards",
    color: "purple",
    actions: [
      "Isolate affected residential block in Zone B2.",
      "Redirect cardiac transports away from Saint Jude ICU.",
      "Deploy public sanitation wash channels."
    ],
    nodes: [
      { id: "1", position: { x: 50, y: 100 }, data: { label: "🧬 Airborne Pathogen Detected" }, style: { background: "#a855f7", color: "#fff", border: "1px solid #9333ea", boxShadow: "0 0 10px rgba(168, 85, 247, 0.4)" } },
      { id: "2", position: { x: 250, y: 40 }, data: { label: "🚨 Quarantine Sectors Established" }, style: { background: "#18181b", color: "#c084fc", border: "1px solid #a855f7" } },
      { id: "3", position: { x: 250, y: 160 }, data: { label: "🏥 Saint Jude ICU Beds Full" }, style: { background: "#ef4444", color: "#fff", border: "1px solid #b91c1c" } },
      { id: "4", position: { x: 480, y: 100 }, data: { label: "🩹 City General Diversion Active" }, style: { background: "#10b981", color: "#fff", border: "1px solid #059669" } }
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2", animated: true },
      { id: "e1-3", source: "1", target: "3", animated: true },
      { id: "e3-4", source: "3", target: "4", animated: true }
    ]
  },
  festival: {
    name: "Festival Crowd Overload",
    type: "Crowd density",
    riskScore: 38,
    affectedPop: "25,000 attendees",
    resources: "32 Guards, 4 Medical Tents, 6 Diverters",
    color: "green",
    actions: [
      "Override traffic priority at Stadium Gate 4.",
      "Position crowd safety dividers near transit hubs.",
      "Pre-stage ambulance unit AMB-102."
    ],
    nodes: [
      { id: "1", position: { x: 50, y: 100 }, data: { label: "🏟️ Stadium Gate 4 Peak Crowd" }, style: { background: "#10b981", color: "#fff", border: "1px solid #059669" } },
      { id: "2", position: { x: 250, y: 100 }, data: { label: "🚌 Transit Hub Saturation" }, style: { background: "#18181b", color: "#a1a1aa", border: "1px solid #27272a" } },
      { id: "3", position: { x: 450, y: 100 }, data: { label: "🚗 Signal priority Adjustment" }, style: { background: "#06b6d4", color: "#fff", border: "1px solid #0891b2" } }
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2", animated: true },
      { id: "e2-3", source: "2", target: "3", animated: true }
    ]
  },
  road: {
    name: "Major Expressway Closure",
    type: "Traffic incident",
    riskScore: 45,
    affectedPop: "12,000 commuters",
    resources: "3 Patrol Units, 4 Sign Displays",
    color: "yellow",
    actions: [
      "Adjust loop traffic signs to detour through Industrial Way.",
      "Extend arterial green light timers by 15 seconds.",
      "Deploy crash clearance team."
    ],
    nodes: [
      { id: "1", position: { x: 50, y: 100 }, data: { label: "💥 Collision Expressway Mile 12" }, style: { background: "#eab308", color: "#fff", border: "1px solid #ca8a04" } },
      { id: "2", position: { x: 250, y: 40 }, data: { label: "🚗 Grid Lock Loop 3" }, style: { background: "#18181b", color: "#fca5a5", border: "1px solid #f87171" } },
      { id: "3", position: { x: 250, y: 160 }, data: { label: "🔄 Detour Display Active" }, style: { background: "#10b981", color: "#fff", border: "1px solid #059669" } },
      { id: "4", position: { x: 480, y: 100 }, data: { label: "🚦 Signal Optimization Priority" }, style: { background: "#06b6d4", color: "#fff", border: "1px solid #0891b2" } }
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2", animated: true },
      { id: "e1-3", source: "1", target: "3", animated: true },
      { id: "e3-4", source: "3", target: "4", animated: true }
    ]
  }
};

export default function ScenarioSimulatorPage() {
  const [activeKey, setActiveKey] = useState<string>("rain");
  const [nodes, setNodes] = useState<Node[]>(SCENARIOS.rain.nodes);
  const [edges, setEdges] = useState<Edge[]>(SCENARIOS.rain.edges);
  const [isRunning, setIsRunning] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Update React Flow dataset when scenario selection changes
  const handleSelectScenario = (key: string) => {
    setActiveKey(key);
    setIsRunning(false);
    setNodes(SCENARIOS[key].nodes);
    setEdges(SCENARIOS[key].edges);
  };

  const handleTriggerSimulation = () => {
    setIsRunning(true);
    // Pulse animation node highlight effect
    const updatedNodes = nodes.map((n, idx) => ({
      ...n,
      style: {
        ...n.style,
        boxShadow: idx === 0 
          ? `0 0 16px ${SCENARIOS[activeKey].color === "red" ? "#ef4444" : "#a855f7"}` 
          : "0 0 8px rgba(255,255,255,0.15)"
      }
    }));
    setNodes(updatedNodes);
  };

  const handleResetSimulation = () => {
    setIsRunning(false);
    setNodes(SCENARIOS[activeKey].nodes);
    setEdges(SCENARIOS[activeKey].edges);
  };

  const activeScenario = SCENARIOS[activeKey];

  const colorClasses = {
    purple: "text-purple-400 border-purple-500/30 bg-purple-500/5",
    cyan: "text-cyan-400 border-cyan-500/30 bg-cyan-500/5",
    green: "text-emerald-400 border-emerald-500/30 bg-emerald-500/5",
    red: "text-rose-400 border-rose-500/30 bg-rose-500/5",
    yellow: "text-amber-400 border-amber-500/30 bg-amber-500/5",
  };

  return (
    <div className="space-y-6 flex-1 flex flex-col min-h-0">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            Disaster Scenario Simulator
          </h1>
          <p className="text-neutral-400 text-xs md:text-sm mt-1">Inject municipal anomalies to preview risk scores, cascading infrastructure outages, and required deployments.</p>
        </div>
      </div>

      {/* Simulator Control Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 shrink-0">
        {Object.entries(SCENARIOS).map(([key, config]) => {
          const isActive = activeKey === key;
          return (
            <button
              key={key}
              onClick={() => handleSelectScenario(key)}
              className={`py-3 px-2.5 rounded-lg border text-xs font-bold text-center transition-all cursor-pointer ${
                isActive 
                  ? "bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/25" 
                  : "bg-white/5 border-white/5 text-neutral-400 hover:text-white hover:bg-white/10"
              }`}
            >
              {config.name}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* Left Side: Simulation telemetries */}
        <div className="lg:col-span-4 space-y-6 flex flex-col shrink-0">
          
          {/* Main Info Card */}
          <GlassCard className="border border-white/5 p-5 space-y-5">
            <div className="flex justify-between items-start border-b border-white/5 pb-3">
              <div>
                <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider">Simulated Incident</span>
                <h3 className="text-base font-extrabold text-white">{activeScenario.name}</h3>
              </div>
              <span className={`text-[10px] border px-2.5 py-0.5 rounded font-bold uppercase ${colorClasses[activeScenario.color]}`}>
                {activeScenario.type}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[10px] text-neutral-500 font-bold uppercase">Risk Index</span>
                <div className={`text-2xl font-black ${
                  activeScenario.riskScore >= 80 ? "text-rose-500" : activeScenario.riskScore >= 60 ? "text-amber-500" : "text-cyan-400"
                }`}>
                  {activeScenario.riskScore}%
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-neutral-500 font-bold uppercase">Impact Capacity</span>
                <div className="text-sm font-bold text-white mt-1.5 truncate">{activeScenario.affectedPop}</div>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-neutral-500 font-bold uppercase block">Resource Requirements</span>
              <div className="text-xs font-semibold text-neutral-300 flex items-center space-x-1.5 pt-1">
                <Wrench className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>{activeScenario.resources}</span>
              </div>
            </div>
          </GlassCard>

          {/* Action Protocols */}
          <GlassCard className="border border-white/5 p-5 space-y-4">
            <div className="flex items-center space-x-2 border-b border-white/5 pb-2">
              <ShieldAlert className="w-4 h-4 text-purple-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Rescue Action Checklist</h3>
            </div>

            <div className="space-y-3">
              {activeScenario.actions.map((act, idx) => (
                <div key={idx} className="flex items-start space-x-2.5 text-xs text-neutral-300 leading-normal">
                  <span className="w-4 h-4 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5 border border-purple-500/25">
                    {idx + 1}
                  </span>
                  <span>{act}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Trigger controls */}
          <GlassCard className="border border-white/5 p-4 flex space-x-4">
            <button
              onClick={handleTriggerSimulation}
              disabled={isRunning}
              className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs py-2.5 px-4 rounded-lg flex items-center justify-center space-x-2 cursor-pointer transition-colors disabled:opacity-40"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Trigger Simulation</span>
            </button>
            
            <button
              onClick={handleResetSimulation}
              disabled={!isRunning}
              className="bg-white/5 border border-white/10 hover:bg-white/10 text-neutral-300 font-bold text-xs py-2.5 px-4 rounded-lg flex items-center justify-center space-x-2 cursor-pointer transition-colors disabled:opacity-40"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </GlassCard>

        </div>

        {/* Right Side: React Flow Canvas */}
        <div className="lg:col-span-8 flex flex-col min-h-[400px] lg:h-full bg-white/[0.01] border border-white/5 rounded-xl overflow-hidden glass relative">
          
          <div className="bg-[#0b0b10] border-b border-white/5 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <Zap className="w-5 h-5 text-purple-400 animate-pulse" />
              <div>
                <span className="text-xs font-bold text-white block">Cascading Infrastructure Outage Graph</span>
                <span className="text-[10px] text-neutral-500">Visualization of dependent outages.</span>
              </div>
            </div>
            <span className="text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 px-2.5 py-0.5 rounded font-bold uppercase flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>{isRunning ? "SIMULATOR ACTIVE" : "STANDBY"}</span>
            </span>
          </div>

          <div className="flex-1 min-h-[350px] relative">
            {mounted && (
              <ReactFlow
                nodes={nodes}
                edges={edges}
                fitView
                fitViewOptions={{ padding: 0.3 }}
                nodesConnectable={false}
                nodesDraggable={false}
                zoomOnScroll={false}
                panOnDrag={true}
              >
                <Background color="#52525b" gap={16} size={1} />
                <Controls showInteractive={false} position="bottom-right" />
              </ReactFlow>
            )}

            {!mounted && (
              <div className="absolute inset-0 flex items-center justify-center text-xs text-neutral-500">
                Initializing Simulation Map Canvas...
              </div>
            )}
          </div>

          {/* Canvas Bottom Instructions */}
          <div className="bg-[#0a0a0f] px-6 py-3 border-t border-white/5 text-[10px] text-neutral-500 flex items-start space-x-2">
            <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <span>Outages model cascading dependencies: Outage 1 (Primary incident) is simulated, triggering cascading outages and overloading surrounding sectors.</span>
          </div>

        </div>

      </div>

    </div>
  );
}
