import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
let genAI: GoogleGenerativeAI | null = null;

if (apiKey) {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
  } catch (error) {
    console.error("Error setting up GoogleGenerativeAI client:", error);
  }
}

// System prompt to guide Gemini's responses
const SYSTEM_PROMPT = `
You are the Genesis AI Decision Support Engine. You assist operators, city planners, and community admins in managing "Delhi" (Genesis Delhi).
Respond as a professional, predictive AI agent with access to live city telemetry (health score, weather, grid loading, ambulance positions).
Provide clear, structured markdown responses. Use lists, bold terms, and key performance data.
When asked about:
1. Traffic predictions: Analyze congestion in sector corridors (like Connaught Place, Mandi House) and suggest dynamic lane re-routing.
2. Flood/Weather hazards: Focus on Yamuna River Sector A, low-lying storm drain congestion, and shelter deployments.
3. Ambulance or resource deployment: Recommend optimal positioning based on hospital capacities (AIIMS Delhi at 91%, Ram Manohar Lohia Hospital at 62%).
4. General decisions: Weigh risk factors, economic impacts, and community safety.
Keep replies action-oriented, data-driven, and brief. Keep layout looking like a premium dashboard notification.
`;

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();
    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: "Messages are required" }, { status: 400 });
    }

    const lastMessage = messages[messages.length - 1].content;

    // ----------------------------------------------------
    // Fallback Mock Decision Logic (if Gemini API key missing)
    // ----------------------------------------------------
    if (!genAI) {
      return NextResponse.json({
        content: getMockGeminiResponse(lastMessage),
        isMock: true
      });
    }

    // ----------------------------------------------------
    // Production Gemini API Call
    // ----------------------------------------------------
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Formatting history for Gemini API
    const prompt = `${SYSTEM_PROMPT}\n\nUser Question: ${lastMessage}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({
      content: text,
      isMock: false
    });

  } catch (error: unknown) {
    console.error("Gemini API Route Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Internal server error: " + errorMessage },
      { status: 500 }
    );
  }
}

// Helper function to return beautiful context-aware mock answers
function getMockGeminiResponse(prompt: string): string {
  const query = prompt.toLowerCase();
  
  if (query.includes("traffic")) {
    return `### 🚦 Traffic Congestion & Route Optimization Report
    
Based on current telemetry, **Connaught Place Outer Circle** is experiencing heavy bottlenecks due to a simulated lane blockage.

* **Current Delay**: +18 minutes.
* **Predicted Peak**: 17:30 - 18:45 (Commute surge).
* **Recommended Actions**:
  1. Trigger dynamic routing displays to divert traffic through **Barakhamba Road**.
  2. Adjust signal timings along the arterial loop by adding **+15 seconds** green priority.
  3. Dispatch traffic management crews to clear the minor vehicle breakdown.`;
  }
  
  if (query.includes("flood") || query.includes("rain") || query.includes("water")) {
    return `### 🌊 Flood Risk Analysis: Yamuna River & Central Basin
    
Heavy rain simulations indicate potential overflow in low-lying zones adjacent to the Yamuna bank channel.

* **Community Risk Rating**: **CRITICAL** (87% probability of street ponding).
* **Active Water Level**: 1.2m above standard retention threshold.
* **Recommended Resource Allocations**:
  1. Deploy mobile flood barriers along **Yamuna Expressway (Sector A)** immediately.
  2. Activate emergency storm pump **Pump #4** to relieve pressure in the low-lying storm drainage system.
  3. Pre-position emergency alerts to residents in **Yamuna Bank** (low-lying residential block).`;
  }

  if (query.includes("ambulance") || query.includes("hospital") || query.includes("medical")) {
    return `### 🏥 Hospital Capacity & Ambulance Dispatch Recommendation
    
Emergency response assets are currently sub-optimally distributed relative to patient congestion.

* **Hospital ICU Occupancies**:
  * *AIIMS Delhi*: **91% capacity** (Critical congestion).
  * *Ram Manohar Lohia Hospital*: **62% capacity** (Sufficient reserve).
  * *Safdarjung Clinic*: **45% capacity** (Available for minor triage).
* **AI Recommended Dispatch**:
  1. Route all incoming non-cardiac emergency transports to **Ram Manohar Lohia Hospital**.
  2. Pre-deploy ambulance units **AMB-102** and **AMB-105** to station near CP transit hub to cut response times in half.`;
  }

  if (query.includes("power") || query.includes("grid") || query.includes("energy")) {
    return `### ⚡ Grid Load Balancing & Energy Supply Simulation
    
Delhi Central Grid Substation 12B is operating at near-maximum capacity due to cooling load demands.

* **Grid Load status**: **94% saturation**.
* **Suggested Action Plan**:
  1. Activate virtual power plant (VPP) battery reservoirs to feed **+12MW** into Grid Loop 3.
  2. Distribute load conservation alerts to residential smart thermostats (automated adjust by +1.5°C).
  3. Postpone scheduled maintenance on generator turbine #2 until load drops below 80%.`;
  }

  return `### 🤖 Genesis AI Decision Engine Active
  
Welcome! I am connected to the Genesis City telemetry dashboard. You can ask me predictive or planning questions such as:

* *Predict tomorrow's traffic congestion.*
* *Which areas are at flood risk after heavy rain?*
* *Recommend ambulance deployment based on hospital capacity.*
* *What energy grid conservation actions should we take?*

Please let me know how I can assist your decision management today.`;
}
