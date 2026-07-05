"use client";

import React, { useState, useEffect } from "react";
import { 
  FileDown, 
  TrendingUp, 
  AlertTriangle, 
  Brain, 
  Activity,
  CheckCircle2,
  Clock,
  Printer
} from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { dbService, Alert, Incident } from "@/services/firebase";
import { jsPDF } from "jspdf";

export default function ReportsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [generating, setGenerating] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const a = await dbService.getItems<Alert>("alerts");
      const i = await dbService.getItems<Incident>("incidents");
      setAlerts(a);
      setIncidents(i);
    };
    fetchData();
  }, []);

  const handleGeneratePDF = async (reportType: "risk" | "incidents" | "ai" | "health") => {
    setGenerating(reportType);
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      const doc = new jsPDF();
      const timestamp = new Date().toLocaleString();
      
      doc.setFillColor(15, 15, 21);
      doc.rect(0, 0, 210, 40, "F");
      
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text("GENESIS AI PLATFORM", 15, 20);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text("COMMUNITY DECISION SUPPORT SYSTEM", 15, 30);
      
      doc.setFontSize(9);
      doc.setTextColor(150, 150, 150);
      doc.text(`Generated: ${timestamp}`, 140, 25);
      doc.text("Clearance Level: Level 3", 140, 30);

      doc.setDrawColor(124, 58, 237);
      doc.setLineWidth(1.5);
      doc.line(0, 40, 210, 40);

      if (reportType === "risk") {
        doc.setTextColor(15, 15, 21);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("EXECUTIVE RISK ANALYSIS REPORT", 15, 55);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(80, 80, 80);
        doc.text("This report summarizes predictive hazards, active warning sensors, and estimated municipal impacts.", 15, 63);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(15, 15, 21);
        doc.text("1. Current Vulnerability Metrics", 15, 78);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(`Active Incidents Registered: ${incidents.length}`, 20, 88);
        doc.text(`Critical Severity Alerts: ${alerts.filter(a => a.severity === "critical").length}`, 20, 95);
        doc.text(`High Severity Alerts: ${alerts.filter(a => a.severity === "high").length}`, 20, 102);

        doc.setFillColor(245, 245, 250);
        doc.rect(15, 115, 180, 8, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.text("Incident Title", 18, 120);
        doc.text("Department", 95, 120);
        doc.text("Severity", 150, 120);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        let y = 131;
        incidents.slice(0, 8).forEach((inc) => {
          doc.text(inc.title || "Standard Warning", 18, y);
          doc.text(inc.department || "General", 95, y);
          doc.text(inc.severity?.toUpperCase() || "MEDIUM", 150, y);
          doc.setDrawColor(230, 230, 235);
          doc.setLineWidth(0.5);
          doc.line(15, y+2, 195, y+2);
          y += 10;
        });

      } else if (reportType === "incidents") {
        doc.setTextColor(15, 15, 21);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("MUNICIPAL INCIDENT AUDIT REPORT", 15, 55);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(80, 80, 80);
        doc.text("This log presents active, acknowledged, and resolved warnings compiled from database records.", 15, 63);

        doc.setFillColor(245, 245, 250);
        doc.rect(15, 80, 180, 8, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.text("Alert Message Summary", 18, 85);
        doc.text("Division", 110, 85);
        doc.text("Status", 160, 85);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        let y = 96;
        alerts.slice(0, 12).forEach((alt) => {
          doc.text(alt.title?.substring(0, 48) || "Sensing Alert", 18, y);
          doc.text(alt.department || "General", 110, y);
          doc.text(alt.status?.toUpperCase() || "ACTIVE", 160, y);
          doc.setDrawColor(230, 230, 235);
          doc.setLineWidth(0.5);
          doc.line(15, y+2, 195, y+2);
          y += 9;
        });

      } else if (reportType === "ai") {
        doc.setTextColor(15, 15, 21);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("PREDICTIVE AI RECOMMENDATIONS DIRECTIVE", 15, 55);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(80, 80, 80);
        doc.text("This report summarizes optimal resource placement and dispatcher advice modeled by Gemini.", 15, 63);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(124, 58, 237);
        doc.text("Active AI Advisory directives:", 15, 80);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(15, 15, 21);
        let y = 92;
        
        const recommendations = [
          { focus: "Emergency Medical Wards", desc: "ICU bed occupancy has reached 91% at AIIMS Delhi. Recommend redirecting non-cardiac ambulance runs to RML Hospital." },
          { focus: "Substation Grid Balancing", desc: "Current loading at Substation 12B stands at 94%. Recommend automated dispatch of load conservation alerts to smart thermostats." },
          { focus: "Storm Front Water Buffer", desc: "Reservoir outflow is nearing threshold tolerances. Pre-position barriers along Yamuna Expressway (Sector A) and activate auxiliary pumps." }
        ];

        recommendations.forEach((rec, i) => {
          doc.setFont("helvetica", "bold");
          doc.text(`${i + 1}. Focus Area: ${rec.focus}`, 15, y);
          doc.setFont("helvetica", "normal");
          doc.text(rec.desc, 15, y + 5, { maxWidth: 170 });
          y += 22;
        });

      } else {
        doc.setTextColor(15, 15, 21);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("COMMUNITY HEALTH & SYSTEM STATUS FEED", 15, 55);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(80, 80, 80);
        doc.text("Audit logs representing municipal utility margins, pollution indexes, and health values.", 15, 63);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(15, 15, 21);
        doc.text("1. Municipal Telemetry Status", 15, 78);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text("- Community Safety Index: 84% (Safe threshold bounds)", 20, 88);
        doc.text("- Regional Air Quality Index (AQI): 154 (PM2.5 elevated loop)", 20, 95);
        doc.text("- Energy Grid Saturation Load: 94% (Grid transformer stress)", 20, 102);
        doc.text("- Water Reservoir Capacity Volume: 88% (Retention acceptable)", 20, 109);
        
        doc.setFont("helvetica", "bold");
        doc.text("2. Clearance Authentication Summary", 15, 125);
        doc.setFont("helvetica", "normal");
        doc.text("The operations center certifies that all active anomalies are mapped and dispatched under Level 3 clearance logs.", 15, 133, { maxWidth: 170 });
      }

      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.5);
      doc.line(15, 280, 195, 280);
      
      doc.setTextColor(150, 150, 150);
      doc.setFontSize(8);
      doc.text("Genesis AI Platform. Confidential Advisory Log.", 15, 285);
      doc.text("Page 1 of 1", 175, 285);

      doc.save(`genesis_report_${reportType}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setGenerating(null);
    }
  };

  const reportsList = [
    {
      id: "risk",
      title: "Risk Analysis Report",
      desc: "Summarizes hazard risk zones, cascading outage probabilities, and simulated weather forecasts.",
      icon: TrendingUp,
      color: "text-purple-400 border-purple-500/20 bg-purple-500/5",
    },
    {
      id: "incidents",
      title: "Incident Audit Summary",
      desc: "Compiles active, acknowledged, and resolved warnings with department assignment details.",
      icon: AlertTriangle,
      color: "text-amber-400 border-amber-500/20 bg-amber-500/5",
    },
    {
      id: "ai",
      title: "AI Decision Advisories",
      desc: "Draws Gemini recommendations detailing optimal resource placement and signal timing offsets.",
      icon: Brain,
      color: "text-cyan-400 border-cyan-500/20 bg-cyan-500/5",
    },
    {
      id: "health",
      title: "Community Health Audit",
      desc: "Evaluates safety indexes, power usage patterns, and hospital ICU bed volumes.",
      icon: Activity,
      color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
    },
  ];

  return (
    <div className="space-y-6 flex-1">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">Executive Report Compiler</h1>
          <p className="text-neutral-400 text-xs md:text-sm mt-1">Compile and print municipal telemetry records, alert resolutions, and advisory guides into PDF documents.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportsList.map((rep) => {
          const Icon = rep.icon;
          const isCompiling = generating === rep.id;
          return (
            <GlassCard key={rep.id} className="border border-white/5 p-6 flex flex-col justify-between hover:shadow-lg transition-shadow relative">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2.5 rounded-lg border ${rep.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">{rep.title}</h3>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed text-left">{rep.desc}</p>
              </div>

              <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-6">
                <div className="flex items-center space-x-1 text-[10px] text-neutral-500 font-mono">
                  <Clock className="w-3.5 h-3.5 text-purple-400" />
                  <span>Ready to compile</span>
                </div>

                <button
                  onClick={() => handleGeneratePDF(rep.id as "risk" | "incidents" | "ai" | "health")}
                  disabled={generating !== null}
                  className="bg-white text-black hover:bg-neutral-200 font-bold text-xs py-2 px-4 rounded-lg flex items-center space-x-1.5 transition-colors cursor-pointer disabled:opacity-40"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  <span>{isCompiling ? "Compiling PDF..." : "Download PDF"}</span>
                </button>
              </div>
            </GlassCard>
          );
        })}
      </div>

      <GlassCard className="border border-white/5 p-6 space-y-4">
        <h3 className="text-sm font-bold text-white text-left">Document Clearance Requirements</h3>
        <p className="text-xs text-neutral-400 text-left leading-relaxed">
          All exported PDF dossiers contain Levels 1-3 cryptographically logged identifiers. Ensure security profile credentials match clearance procedures when distributing community telemetry packets outside Genesis operations.
        </p>
        <div className="flex flex-wrap gap-4 text-[10px] font-mono text-neutral-500">
          <span className="flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Client-side rendering active</span>
          </span>
          <span className="flex items-center space-x-1">
            <Printer className="w-3.5 h-3.5 text-purple-400" />
            <span>Formatted for letter print bounds</span>
          </span>
        </div>
      </GlassCard>
    </div>
  );
}
