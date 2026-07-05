"use client";

import React from "react";
import GlassCard from "./GlassCard";
import { cn } from "@/utils/cn";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number; // e.g. +4.5 or -2.3
  changeLabel?: string;
  icon: React.ReactNode;
  color?: "purple" | "cyan" | "green" | "red" | "yellow";
  delay?: number;
}

export default function MetricCard({
  title,
  value,
  change,
  changeLabel = "vs last hour",
  icon,
  color = "purple",
  delay = 0
}: MetricCardProps) {
  const isPositive = change !== undefined ? change >= 0 : true;

  const colorStyles = {
    purple: {
      border: "hover:border-purple-500/30",
      glow: "bg-purple-500/10",
      text: "text-purple-400",
      bar: "bg-purple-500"
    },
    cyan: {
      border: "hover:border-cyan-500/30",
      glow: "bg-cyan-500/10",
      text: "text-cyan-400",
      bar: "bg-cyan-500"
    },
    green: {
      border: "hover:border-emerald-500/30",
      glow: "bg-emerald-500/10",
      text: "text-emerald-400",
      bar: "bg-emerald-500"
    },
    red: {
      border: "hover:border-rose-500/30",
      glow: "bg-rose-500/10",
      text: "text-rose-400",
      bar: "bg-rose-500"
    },
    yellow: {
      border: "hover:border-amber-500/30",
      glow: "bg-amber-500/10",
      text: "text-amber-400",
      bar: "bg-amber-500"
    }
  };

  const style = colorStyles[color];

  return (
    <GlassCard 
      hoverScale 
      delay={delay}
      className={cn("relative group border border-white/5", style.border)}
    >
      {/* Background glow node */}
      <div className={cn("absolute -right-6 -top-6 w-20 h-20 rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500", style.glow)} />

      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-muted-foreground tracking-wide">{title}</span>
        <div className={cn("p-2 rounded-lg bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-300", style.text)}>
          {icon}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-3xl font-bold tracking-tight text-white">{value}</h3>
        
        {change !== undefined && (
          <div className="flex items-center space-x-1.5 text-xs">
            <span className={cn(
              "flex items-center font-semibold",
              isPositive ? "text-emerald-400" : "text-rose-400"
            )}>
              {isPositive ? <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
              {isPositive ? "+" : ""}{change}%
            </span>
            <span className="text-muted-foreground">{changeLabel}</span>
          </div>
        )}
      </div>

      {/* Decorative interactive bar */}
      <div className="w-full h-1 bg-white/5 rounded-full mt-5 overflow-hidden">
        <div className={cn("h-full w-full rounded-full origin-left scale-x-[0.6] group-hover:scale-x-[0.9] transition-transform duration-700 ease-out", style.bar)} />
      </div>
    </GlassCard>
  );
}
