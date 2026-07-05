"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Send, 
  Mic, 
  MicOff, 
  Cpu, 
  User, 
  Brain,
  HelpCircle,
  Clock,
  Trash2
} from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { sendChatMessage, ChatMessage } from "@/services/gemini";

const QUICK_PROMPTS = [
  "Predict tomorrow's traffic congestion corridors.",
  "Which areas are at flood risk after heavy rain?",
  "Recommend ambulance deployment based on hospital capacity.",
  "Show hospitals with available bed capacity."
];

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "model",
      content: `### 🤖 Genesis AI Decision Assistant
      
Welcome to the operations support channel. I have scanned the active city database telemetry.

**How can I assist your team today?** Feel free to choose one of the suggested prompts below or type your custom planning query directly.`
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const waveCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Audio wave visualization simulation
  useEffect(() => {
    if (!isRecording) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    const canvas = waveCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let phase = 0;
    const renderWave = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "#8b5cf6";
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      // Draw 3 waves
      for (let w = 0; w < 3; w++) {
        const amplitude = 15 - w * 4;
        const speed = 0.15 + w * 0.05;
        
        ctx.beginPath();
        for (let x = 0; x < canvas.width; x++) {
          const y = (canvas.height / 2) + Math.sin(x * 0.03 + phase * speed) * amplitude * Math.sin(x * 0.005);
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.strokeStyle = w === 0 ? "rgba(139, 92, 246, 0.8)" : w === 1 ? "rgba(6, 182, 212, 0.5)" : "rgba(139, 92, 246, 0.2)";
        ctx.stroke();
      }
      
      phase += 1;
      animationFrameRef.current = requestAnimationFrame(renderWave);
    };

    renderWave();

    // Simulated speech recognition timer: turns off after 4 seconds and inserts a prompt!
    const timer = setTimeout(() => {
      setIsRecording(false);
      const voicePrompts = [
        "Predict tomorrow's traffic congestion corridors.",
        "Recommend ambulance deployment based on hospital capacity."
      ];
      const randomPrompt = voicePrompts[Math.floor(Math.random() * voicePrompts.length)];
      setInputValue(randomPrompt);
    }, 4500);

    return () => {
      clearTimeout(timer);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isRecording]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMessage: ChatMessage = { role: "user", content: text };
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setLoading(true);

    try {
      // Append temp system message if history gets too long, but we keep it simple
      const apiResponse = await sendChatMessage([...messages, userMessage]);
      setMessages(prev => [...prev, { role: "model", content: apiResponse.content }]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        role: "model",
        content: "System chat logs flushed. Genesis AI decision interface is ready for queries."
      }
    ]);
  };

  // Simple clean parsing helper to render markdown lists, headers, bold text
  const formatMarkdown = (content: string) => {
    const lines = content.split("\n");
    return lines.map((line, i) => {
      const trimmed = line.trim();
      
      // Header H3
      if (trimmed.startsWith("###")) {
        return <h3 key={i} className="text-sm font-bold text-white mt-3 mb-2">{trimmed.replace("###", "")}</h3>;
      }
      // Header H4
      if (trimmed.startsWith("####")) {
        return <h4 key={i} className="text-xs font-bold text-purple-400 mt-2 mb-1">{trimmed.replace("####", "")}</h4>;
      }
      // Bullet list
      if (trimmed.startsWith("*") || trimmed.startsWith("-")) {
        return (
          <li key={i} className="ml-4 list-disc text-neutral-300 text-[11px] mb-1.5 leading-relaxed">
            {parseBoldText(trimmed.substring(1).trim())}
          </li>
        );
      }
      // Ordered list
      if (/^\d+\./.test(trimmed)) {
        const dotIndex = trimmed.indexOf(".");
        const num = trimmed.substring(0, dotIndex);
        const text = trimmed.substring(dotIndex + 1).trim();
        return (
          <div key={i} className="ml-2 text-[11px] text-neutral-300 mb-1.5 leading-relaxed flex items-start">
            <span className="text-cyan-400 font-bold mr-1.5 shrink-0">{num}.</span>
            <span>{parseBoldText(text)}</span>
          </div>
        );
      }
      
      return <p key={i} className="text-[11px] text-neutral-300 leading-relaxed mb-2">{parseBoldText(trimmed)}</p>;
    });
  };

  // Helper to parse **bold** formatting
  const parseBoldText = (text: string) => {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return <strong key={index} className="text-white font-bold">{part}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="space-y-6 flex-1 flex flex-col min-h-0">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            Gemini Decision Agent
          </h1>
          <p className="text-neutral-400 text-xs md:text-sm mt-1">Converse directly with Gemini to process city data and predict risk corridors.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* Left Side: Voice controls & suggestions */}
        <div className="lg:col-span-4 space-y-6 flex flex-col shrink-0">
          
          {/* Quick Prompts Panel */}
          <GlassCard className="border border-white/5 p-5 space-y-4">
            <div className="flex items-center space-x-2 border-b border-white/5 pb-2">
              <HelpCircle className="w-4 h-4 text-purple-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Suggested Prompts</h3>
            </div>
            
            <div className="space-y-2.5">
              {QUICK_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(prompt)}
                  className="w-full text-left bg-white/5 hover:bg-white/10 border border-white/5 p-3 rounded-lg text-xs text-neutral-300 hover:text-white transition-colors cursor-pointer block leading-normal"
                  disabled={loading}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </GlassCard>

          {/* Voice Input Section */}
          <GlassCard className="border border-white/5 p-5 space-y-4 text-center">
            <div className="flex items-center space-x-2 border-b border-white/5 pb-2 text-left">
              <Mic className="w-4 h-4 text-purple-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Voice Control</h3>
            </div>

            <div className="py-4 flex flex-col items-center space-y-4">
              <button
                onClick={() => setIsRecording(!isRecording)}
                className={`w-16 h-16 rounded-full flex items-center justify-center border shadow-lg transition-all duration-300 cursor-pointer ${
                  isRecording 
                    ? "bg-rose-600/10 border-rose-500 text-rose-400 scale-95 shadow-rose-500/20" 
                    : "bg-purple-600 hover:bg-purple-500 border-purple-500/35 text-white hover:scale-105 shadow-purple-500/15"
                }`}
              >
                {isRecording ? <MicOff className="w-6 h-6 animate-pulse" /> : <Mic className="w-6 h-6" />}
              </button>
              
              <div className="text-xs">
                <span className="font-bold text-white block">
                  {isRecording ? "Listening & Capturing..." : "Voice Input Offline"}
                </span>
                <span className="text-[10px] text-neutral-500 mt-1 block">
                  {isRecording ? "Transcribing speech patterns..." : "Click microphone to activate voice telemetry"}
                </span>
              </div>

              {/* Audio Wave Visualizer Canvas */}
              <div className={`w-full h-12 rounded-lg bg-black/30 border border-white/5 overflow-hidden transition-opacity duration-300 ${isRecording ? "opacity-100" : "opacity-30"}`}>
                <canvas 
                  ref={waveCanvasRef} 
                  width={280} 
                  height={48} 
                  className="w-full h-full"
                />
              </div>
            </div>
          </GlassCard>

          {/* Session details */}
          <GlassCard className="border border-white/5 p-4 flex items-center justify-between text-xs text-neutral-500">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-purple-400" />
              <span>Decisions cached locally</span>
            </div>
            <button 
              onClick={handleClearHistory}
              className="text-rose-400 hover:underline flex items-center space-x-1 cursor-pointer font-semibold"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          </GlassCard>

        </div>

        {/* Right Side: Chat box container */}
        <div className="lg:col-span-8 flex flex-col min-h-[450px] lg:h-full bg-white/[0.01] border border-white/5 rounded-xl overflow-hidden glass relative">
          
          {/* Thread Header */}
          <div className="bg-[#0b0b10] border-b border-white/5 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <Brain className="w-5 h-5 text-purple-400" />
              <div>
                <span className="text-xs font-bold text-white block">Genesis Decision Matrix</span>
                <span className="text-[10px] text-neutral-500">Connected to active parameters.</span>
              </div>
            </div>
            <span className="text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/25 px-2.5 py-0.5 rounded font-bold uppercase">
              Gemini Flash 1.5
            </span>
          </div>

          {/* Thread Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg, index) => {
              const isUser = msg.role === "user";
              return (
                <div 
                  key={index}
                  className={`flex items-start space-x-3.5 max-w-[85%] ${isUser ? "ml-auto flex-row-reverse space-x-reverse" : "mr-auto"}`}
                >
                  <div className={`p-2 rounded-lg shrink-0 ${isUser ? "bg-cyan-500/10 border border-cyan-500/20 text-cyan-400" : "bg-purple-500/10 border border-purple-500/20 text-purple-400"}`}>
                    {isUser ? <User className="w-4 h-4" /> : <Cpu className="w-4 h-4" />}
                  </div>

                  <div className={`p-4 rounded-xl text-left border ${
                    isUser 
                      ? "bg-cyan-950/15 border-cyan-500/15 text-neutral-200" 
                      : "bg-[#0f0f15]/80 border-white/5 text-neutral-100"
                  }`}>
                    {isUser ? (
                      <p className="text-[11px] text-neutral-200 font-sans">{msg.content}</p>
                    ) : (
                      <div className="space-y-1">
                        {formatMarkdown(msg.content)}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex items-start space-x-3.5 mr-auto">
                <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 animate-pulse">
                  <Cpu className="w-4 h-4" />
                </div>
                <div className="p-4 rounded-xl border bg-[#0f0f15]/80 border-white/5 text-neutral-400 text-xs flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                  <span className="text-[10px] font-mono text-neutral-500">Gemini analyzing city configurations...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Form input box */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputValue);
            }} 
            className="p-4 bg-[#0a0a0f] border-t border-white/5 flex items-center space-x-3"
          >
            <input
              type="text"
              placeholder="Ask Gemini to predict traffic, check weather warning or resource capacity..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500/50"
              disabled={loading}
            />
            
            <button
              type="submit"
              disabled={!inputValue.trim() || loading}
              className="p-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

      </div>

    </div>
  );
}
