"use client";

import React, { useEffect, useRef } from "react";
import L from "leaflet";
import { Incident } from "@/services/firebase";

interface LiveMapProps {
  incidents: Incident[];
  filters: {
    incidents: boolean;
    hospitals: boolean;
    police: boolean;
    shelters: boolean;
    riskZones: boolean;
  };
  searchQuery: string;
  onAddIncidentClick: (lat: number, lng: number) => void;
  activeIncidentRoute: { start: [number, number]; end: [number, number]; color?: string } | null;
}

// Fixed coordinates for municipal assets in Genesis City
const CITY_ASSETS = {
  hospitals: [
    { name: "AIIMS Delhi", coords: [28.5672, 77.2100] as [number, number], beds: "9% Available" },
    { name: "Ram Manohar Lohia Hospital", coords: [28.6238, 77.2016] as [number, number], beds: "38% Available" },
    { name: "Safdarjung Hospital", coords: [28.5685, 77.2060] as [number, number], beds: "55% Available" }
  ],
  police: [
    { name: "New Delhi Police Headquarters", coords: [28.6272, 77.2150] as [number, number], officers: "14 On-Duty" },
    { name: "Connaught Place Police Station", coords: [28.6295, 77.2205] as [number, number], officers: "22 On-Duty" }
  ],
  shelters: [
    { name: "India Gate Refuge Shelter", coords: [28.6129, 77.2295] as [number, number], capacity: "84% Occupied" },
    { name: "Yamuna Bank Flood Haven", coords: [28.6210, 77.2660] as [number, number], capacity: "12% Occupied" }
  ],
  riskZones: [
    { name: "Yamuna River Sector A Flood Basin", coords: [28.6260, 77.2720] as [number, number], radius: 800, risk: "High Flood Risk" },
    { name: "Connaught Place Outer Circle Zone", coords: [28.6320, 77.2180] as [number, number], radius: 500, risk: "AQI Saturation" }
  ]
};

export default function LiveMap({
  incidents,
  filters,
  searchQuery,
  onAddIncidentClick,
  activeIncidentRoute
}: LiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const routeRef = useRef<L.Polyline | null>(null);
  const zonesRef = useRef<L.LayerGroup | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Center on Genesis City (Delhi bounding coordinates)
    const map = L.map(mapContainerRef.current, {
      center: [28.6250, 77.2200],
      zoom: 13,
      zoomControl: false
    });

    // Dark-themed tiles from CartoDB (perfect for glassmorphic design)
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 20
    }).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);

    // Event listener: Add incident on map click
    map.on("click", (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      // Trigger callback
      onAddIncidentClick(lat, lng);
    });

    mapRef.current = map;
    markersRef.current = L.layerGroup().addTo(map);
    zonesRef.current = L.layerGroup().addTo(map);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [onAddIncidentClick]);

  // Handle Search Queries
  useEffect(() => {
    if (!mapRef.current || !searchQuery) return;
    
    const query = searchQuery.toLowerCase();
    
    // Check assets first
    const allLocations = [
      ...CITY_ASSETS.hospitals,
      ...CITY_ASSETS.police,
      ...CITY_ASSETS.shelters,
      ...incidents
    ];

    const match = allLocations.find((loc: unknown) => {
      const l = loc as Record<string, unknown>;
      const name = typeof l.name === "string" ? l.name : "";
      const title = typeof l.title === "string" ? l.title : "";
      return (name.toLowerCase() || title.toLowerCase() || "").includes(query);
    });
    
    if (match) {
      const m = match as Record<string, unknown>;
      const coords = (m.coords || m.coordinates) as [number, number];
      if (coords) {
        mapRef.current.setView(coords, 15, { animate: true });
      }
    }
  }, [searchQuery, incidents]);

  // Update Markers based on Filters
  useEffect(() => {
    const map = mapRef.current;
    const markers = markersRef.current;
    const zones = zonesRef.current;
    if (!map || !markers || !zones) return;

    // Clear previous items
    markers.clearLayers();
    zones.clearLayers();

    // 1. Render Active Incidents
    if (filters.incidents) {
      incidents.forEach((inc) => {
        if (!inc.coordinates || inc.coordinates.length < 2) return;
        
        const severityColor = inc.severity === "critical" ? "#ef4444" : inc.severity === "high" ? "#f59e0b" : "#06b6d4";
        
        const pulseHtml = `
          <div style="position: relative; width: 24px; height: 24px; display: flex; items-center; justify-content: center;">
            <div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background-color: ${severityColor}; opacity: 0.15; transform: scale(1.8); animation: leaflet-ping 1.5s infinite ease-out;"></div>
            <div style="width: 10px; height: 10px; border-radius: 50%; background-color: ${severityColor}; border: 1.5px solid #fff; box-shadow: 0 0 6px ${severityColor};"></div>
          </div>
        `;

        const pulseIcon = L.divIcon({
          html: pulseHtml,
          className: "",
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const popupContent = `
          <div style="font-family: sans-serif; font-size: 11px; padding: 4px;">
            <span style="font-weight: bold; color: #ef4444; font-size: 10px; text-transform: uppercase;">⚠️ ${inc.severity} Incident</span>
            <h4 style="margin: 4px 0 2px; font-weight: bold; color: #fff;">${inc.title}</h4>
            <p style="margin: 0 0 6px; color: #a1a1aa;">${inc.description}</p>
            <div style="display: flex; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 4px; font-size: 9px; color: #71717a;">
              <span>Status: ${inc.status}</span>
              <span>Div: ${inc.department}</span>
            </div>
          </div>
        `;

        L.marker(inc.coordinates, { icon: pulseIcon })
          .bindPopup(popupContent)
          .addTo(markers);
      });
    }

    // 2. Render Hospitals
    if (filters.hospitals) {
      CITY_ASSETS.hospitals.forEach((hosp) => {
        const hospitalHtml = `
          <div style="background-color: #06b6d4; border: 1.5px solid #fff; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 8px #06b6d4;">
            <span style="color: #fff; font-size: 11px; font-weight: bold; line-height: 1;">H</span>
          </div>
        `;
        const icon = L.divIcon({
          html: hospitalHtml,
          className: "",
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });

        const popup = `
          <div style="font-family: sans-serif; font-size: 11px; padding: 4px;">
            <span style="color: #06b6d4; font-weight: bold; text-transform: uppercase; font-size: 9px;">🏥 Medical Asset</span>
            <h4 style="margin: 3px 0; color: #fff;">${hosp.name}</h4>
            <span style="color: #a1a1aa;">Emergency beds: <strong>${hosp.beds}</strong></span>
          </div>
        `;

        L.marker(hosp.coords, { icon })
          .bindPopup(popup)
          .addTo(markers);
      });
    }

    // 3. Render Police
    if (filters.police) {
      CITY_ASSETS.police.forEach((pol) => {
        const policeHtml = `
          <div style="background-color: #8b5cf6; border: 1.5px solid #fff; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 8px #8b5cf6;">
            <span style="color: #fff; font-size: 10px; font-weight: bold; line-height: 1;">P</span>
          </div>
        `;
        const icon = L.divIcon({
          html: policeHtml,
          className: "",
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });

        const popup = `
          <div style="font-family: sans-serif; font-size: 11px; padding: 4px;">
            <span style="color: #8b5cf6; font-weight: bold; text-transform: uppercase; font-size: 9px;">🛡️ Security Station</span>
            <h4 style="margin: 3px 0; color: #fff;">${pol.name}</h4>
            <span style="color: #a1a1aa;">Personnel: <strong>${pol.officers}</strong></span>
          </div>
        `;

        L.marker(pol.coords, { icon })
          .bindPopup(popup)
          .addTo(markers);
      });
    }

    // 4. Render Shelters
    if (filters.shelters) {
      CITY_ASSETS.shelters.forEach((she) => {
        const shelterHtml = `
          <div style="background-color: #10b981; border: 1.5px solid #fff; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 8px #10b981;">
            <span style="color: #fff; font-size: 10px; font-weight: bold; line-height: 1;">S</span>
          </div>
        `;
        const icon = L.divIcon({
          html: shelterHtml,
          className: "",
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });

        const popup = `
          <div style="font-family: sans-serif; font-size: 11px; padding: 4px;">
            <span style="color: #10b981; font-weight: bold; text-transform: uppercase; font-size: 9px;">🏕️ Evacuation Shelter</span>
            <h4 style="margin: 3px 0; color: #fff;">${she.name}</h4>
            <span style="color: #a1a1aa;">Capacity status: <strong>${she.capacity}</strong></span>
          </div>
        `;

        L.marker(she.coords, { icon })
          .bindPopup(popup)
          .addTo(markers);
      });
    }

    // 5. Render Risk Zones
    if (filters.riskZones) {
      CITY_ASSETS.riskZones.forEach((zone) => {
        const color = zone.risk.includes("Flood") ? "#ef4444" : "#eab308";
        L.circle(zone.coords, {
          color,
          fillColor: color,
          fillOpacity: 0.1,
          radius: zone.radius,
          weight: 1.5
        })
          .bindPopup(`
            <div style="font-family: sans-serif; font-size: 11px; padding: 2px; color:#fff;">
              <strong style="color:${color}; text-transform:uppercase;">${zone.risk}</strong>
              <div style="margin-top:2px;">Radius: ${zone.radius}m</div>
            </div>
          `)
          .addTo(zones);
      });
    }

  }, [filters, incidents]);

  // Handle Route Rendering (Polylines)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (routeRef.current) {
      map.removeLayer(routeRef.current);
      routeRef.current = null;
    }

    if (activeIncidentRoute) {
      const { start, end, color } = activeIncidentRoute;
      
      // Calculate a simple simulated curved or bent road path
      const midPoint: [number, number] = [
        (start[0] + end[0]) / 2 + 0.003,
        (start[1] + end[1]) / 2 - 0.002
      ];

      const routePoints = [start, midPoint, end];

      const polyline = L.polyline(routePoints, {
        color: color || "#8b5cf6",
        weight: 4,
        opacity: 0.8,
        dashArray: "8, 6",
        className: "leaflet-route-line"
      }).addTo(map);

      // Fit bounds to show route
      map.fitBounds(polyline.getBounds(), { padding: [50, 50] });
      routeRef.current = polyline;
    }
  }, [activeIncidentRoute]);

  return (
    <>
      <style jsx global>{`
        @keyframes leaflet-ping {
          0% { transform: scale(1); opacity: 0.5; }
          70% { transform: scale(1.6); opacity: 0.05; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        .leaflet-route-line {
          animation: route-dash 30s linear infinite;
        }
        @keyframes route-dash {
          to {
            stroke-dashoffset: -20;
          }
        }
      `}</style>
      <div ref={mapContainerRef} className="w-full h-full min-h-[450px] relative dark-leaflet rounded-xl" />
    </>
  );
}
