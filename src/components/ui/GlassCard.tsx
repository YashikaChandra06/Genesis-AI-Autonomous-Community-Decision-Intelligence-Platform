"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/utils/cn";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  hoverScale?: boolean;
  delay?: number;
}

export default function GlassCard({
  children,
  className,
  glow = false,
  hoverScale = false,
  delay = 0,
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay, ease: "easeOut" }}
      whileHover={hoverScale ? { y: -3, scale: 1.01 } : undefined}
      className={cn(
        "glass rounded-xl p-5 overflow-hidden transition-all duration-300",
        glow && "glass-card-glow",
        hoverScale && "hover:shadow-[0_8px_30px_rgb(0,0,0,0.3)]",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
