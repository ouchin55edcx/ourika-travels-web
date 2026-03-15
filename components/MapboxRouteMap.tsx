"use client";
import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

type StepCoords = {
  id: number;
  title: string;
  shortLabel?: string;
  coordinates?: { lng: number; lat: number };
};

type Props = {
  steps: StepCoords[];
  activeStepId: number | null;
  onMarkerClick: (stepId: number) => void;
};

async function fetchRoute(
  waypoints: { lng: number; lat: number }[],
  token: string,
): Promise<GeoJSON.LineString | null> {
  if (waypoints.length < 2) return null;
  const coords = waypoints.map((w) => `${w.lng},${w.lat}`).join(";");
  const url =
    `https://api.mapbox.com/directions/v5/mapbox/driving/${coords}` +
    `?geometries=geojson&overview=full&access_token=${token}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.routes?.length > 0) {
      return data.routes[0].geometry as GeoJSON.LineString;
    }
  } catch (e) {
    console.error("[Mapbox Directions] error:", e);
  }
  return null;
}

export default function MapboxRouteMap({ steps, activeStepId, onMarkerClick }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<Map<number, mapboxgl.Marker>>(new Map());
  const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

  // ── Init map once ────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    mapboxgl.accessToken = TOKEN;

    mapRef.current = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/outdoors-v12",
      center: [-7.9811, 31.6295],
      zoom: 9,
      attributionControl: false,
    });

    const map = mapRef.current;
    map.addControl(new mapboxgl.AttributionControl({ compact: true }), "bottom-left");
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "bottom-right");

    map.on("load", () => {
      // Route source — starts empty, updated after Directions API call
      map.addSource("route", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });

      // Animated route outline (glow effect)
      map.addLayer({
        id: "route-outline",
        type: "line",
        source: "route",
        paint: {
          "line-color": "#00ef9d",
          "line-width": 6,
          "line-opacity": 0.25,
          "line-blur": 4,
        },
      });

      // Main route line
      map.addLayer({
        id: "route-line",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#003b1f",
          "line-width": 4,
          "line-opacity": 0.9,
        },
      });
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // ── Update markers + fetch real route when steps change ──────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const pinned = steps.filter((s) => s.coordinates);

    async function updateMap() {
      // Clear old markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current.clear();

      // Add numbered markers
      pinned.forEach((s) => {
        const isActive = s.id === activeStepId;
        const el = document.createElement("div");
        el.style.cssText = `
          width:36px; height:36px; border-radius:50%;
          background:${isActive ? "#00ef9d" : "#003b1f"};
          color:${isActive ? "#003b1f" : "white"};
          display:flex; align-items:center; justify-content:center;
          font-size:14px; font-weight:900; cursor:pointer;
          border:2.5px solid white;
          box-shadow:0 2px 12px rgba(0,0,0,0.35);
          transition:transform 0.2s, background 0.2s;
          transform:${isActive ? "scale(1.2)" : "scale(1)"};
        `;
        el.innerHTML = `<span>${s.id}</span>`;
        el.onclick = () => onMarkerClick(s.id);

        // Tooltip popup
        const popup = new mapboxgl.Popup({
          offset: 20,
          closeButton: false,
          closeOnClick: false,
          className: "trek-popup",
        }).setText(s.shortLabel || s.title);

        el.addEventListener("mouseenter", () => popup.addTo(map));
        el.addEventListener("mouseleave", () => popup.remove());

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([s.coordinates!.lng, s.coordinates!.lat])
          .addTo(map);

        markersRef.current.set(s.id, marker);
      });

      // Fetch REAL road route from Mapbox Directions API
      const routeGeometry = await fetchRoute(
        pinned.map((s) => s.coordinates!),
        TOKEN,
      );

      // Update route source
      const source = map.getSource("route") as mapboxgl.GeoJSONSource;
      if (source) {
        source.setData({
          type: "FeatureCollection",
          features: routeGeometry
            ? [
                {
                  type: "Feature",
                  geometry: routeGeometry,
                  properties: {},
                },
              ]
            : [],
        });
      }

      // Fit all markers in view
      if (pinned.length >= 2) {
        const bounds = new mapboxgl.LngLatBounds();
        pinned.forEach((s) => bounds.extend([s.coordinates!.lng, s.coordinates!.lat]));
        map.fitBounds(bounds, { padding: 80, duration: 1000, maxZoom: 13 });
      } else if (pinned.length === 1) {
        map.flyTo({
          center: [pinned[0].coordinates!.lng, pinned[0].coordinates!.lat],
          zoom: 12,
          duration: 1000,
        });
      }
    }

    if (map.loaded()) updateMap();
    else map.on("load", updateMap);
  }, [steps, activeStepId]);

  // ── Fly to active step when user clicks a stop ───────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map || activeStepId === null) return;
    const step = steps.find((s) => s.id === activeStepId);
    if (step?.coordinates) {
      map.flyTo({
        center: [step.coordinates.lng, step.coordinates.lat],
        zoom: 12,
        duration: 900,
        essential: true,
      });
    }
  }, [activeStepId]);

  return <div ref={containerRef} className="h-full w-full overflow-hidden rounded-[20px]" />;
}
