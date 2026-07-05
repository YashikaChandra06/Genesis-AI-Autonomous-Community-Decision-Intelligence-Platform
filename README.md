# Genesis AI - Community Decision Intelligence Platform

Genesis AI is a production-ready, full-stack decision support platform designed for communities, governments, and organizations. The platform ingests municipal telemetries (traffic, grid loads, hospital occupancies, AQI), predicts regional hazards, models cascading utility outages, and compiles AI advisory recommendations using Google Gemini.

It is designed as a single self-contained repository built on **Next.js 16/15 (App Router)** and is deployable directly to **Render** in one click.

---

## ⚡ Key Features

1. **Operations Overview**: High-end telemetric KPI cards and responsive line/area charts tracking grid loads, PM2.5 levels, and ICU capacities.
2. **Smart City Geo-Sensing**: Visual Leaflet-based dark map displaying incident markers, hospitals, shelters, and police divisions with simulated rescue dispatch routes.
3. **Gemini Decision Agent**: Conversational assistant leveraging `gemini-1.5-flash` with a microphone visualization UI and preset prompt templates.
4. **Scenario Simulator**: Cascading municipal failure model (Storm, Flash Flooding, Power Outage, Disease Outbreak) mapped dynamically using React Flow.
5. **Incident Alerts Center**: Active alarm broadcast with filtering capabilities allowing operators to acknowledge, audit, and resolve alerts.
6. **Executive Report Compiler**: Print-ready, client-side PDF document compiler for Risk Analysis, Alerts, and AI Decisions using `jsPDF`.
7. **Federated Auth & RBAC**: Layered user clearances (Admin, Operator, Member) integrated with Firebase Authentication and client-side failover support.

---

## 🛠️ Technology Stack

* **Core**: Next.js 16/15 (App Router), React 19, TypeScript
* **Styling**: Tailwind CSS v4, Glassmorphic UI overlays
* **Animations**: Framer Motion
* **Visualizations**: Recharts, React Flow (`@xyflow/react`)
* **Mapping**: Leaflet (OpenStreetMap Dark Tiles)
* **Authentication & Database**: Firebase Auth & Firestore Client SDK
* **AI Support Engine**: Google Gemini API SDK (`@google/generative-ai`)
* **Document Compilation**: jsPDF

---

## ⚙️ Environment Variables

Genesis AI implements an **automatic fallback simulation mode**. If no API keys are supplied, the application runs entirely in sandboxed mock mode (storing auth states and alerts dynamically in local storage). 

To connect to cloud services, create a `.env` file at the root:

```bash
# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Firebase Web SDK Credentials
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
```

---

## 📂 Project Structure

```
├── .env.example
├── render.yaml                    # One-click Render deployment configuration
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Global layout & styles
│   │   ├── page.tsx               # Landing Page (Futuristic Hero & Previews)
│   │   ├── login/page.tsx         # Secure login page (with Sandbox Bypass)
│   │   ├── register/page.tsx      # Account signup page with role clearance selection
│   │   ├── api/chat/route.ts      # Backend Next.js route handler querying Gemini
│   │   └── dashboard/
│   │       ├── layout.tsx         # Sidebar shell with clearance level guards
│   │       ├── page.tsx           # Telemetries overview & charts
│   │       ├── map/page.tsx       # Dynamic Smart City Map
│   │       ├── assistant/page.tsx # Gemini conversational agent (with audio wave UI)
│   │       ├── simulator/page.tsx # Disaster Cascading Flowchart
│   │       ├── alerts/page.tsx    # Alerts broadcast table & manual injector
│   │       ├── reports/page.tsx   # PDF compiling engine
│   │       ├── settings/page.tsx  # API key configs & diagnostic loggers
│   │       └── admin/page.tsx     # Admin-only user role clearance adjuster
│   ├── components/
│   │   ├── ui/                    # Reusable visual widgets (GlassCard, MetricCard)
│   │   └── map/
│   │       └── LiveMap.tsx        # Client-only Leaflet wrapper
│   ├── services/
│   │   ├── firebase.ts            # Client-side SDK layer with LocalStorage failover
│   │   └── gemini.ts              # Gemini client wrapper calling api chat router
│   └── utils/
│       └── cn.ts                  # Utility class merger helper
```

---

## 🚀 Render Deployment (GitHub Auto-Deploy)

This repository contains a pre-configured `render.yaml` blueprint. To deploy:

1. Push this codebase to a public/private GitHub repository.
2. Log into your **Render Dashboard** (https://dashboard.render.com).
3. Click **New** > **Blueprint**.
4. Connect your GitHub repository.
5. Render will automatically parse the `render.yaml` file:
   * **Build Command**: `npm install && npm run build`
   * **Start Command**: `npm start`
6. (Optional) Provide the environment variables (`GEMINI_API_KEY`, etc.) in the prompt boxes. If omitted, the platform deploys in full interactive simulation mode.
7. Click **Approve** to deploy!
