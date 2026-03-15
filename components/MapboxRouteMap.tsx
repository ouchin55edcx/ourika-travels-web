'use client';
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

type StepCoords = {
    id: number;
    title: string;
    coordinates?: { lng: number; lat: number };
};

type Props = {
    steps: StepCoords[];
    activeStepId: number | null;
    onMarkerClick: (stepId: number) => void;
};

export default function MapboxRouteMap({ steps, activeStepId, onMarkerClick }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const markersRef = useRef<Map<number, mapboxgl.Marker>>(new Map());

    // ── Init map once ──────────────────────────────────────────────────
    useEffect(() => {
        if (!containerRef.current || mapRef.current) return;
        mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

        mapRef.current = new mapboxgl.Map({
            container: containerRef.current,
            style: 'mapbox://styles/mapbox/outdoors-v12',
            center: [-7.9811, 31.6295],
            zoom: 9,
            attributionControl: false,
        });

        mapRef.current.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-left');
        mapRef.current.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-right');

        const map = mapRef.current;

        map.on('load', () => {
            map.addSource('route', {
                type: 'geojson',
                data: buildGeoJSON(steps.filter(s => s.coordinates)),
            });
            map.addLayer({
                id: 'route-line',
                type: 'line',
                source: 'route',
                paint: {
                    'line-color': '#0b3a2c',
                    'line-width': 3,
                    'line-dasharray': [2, 1.5],
                },
            });
        });

        return () => { mapRef.current?.remove(); mapRef.current = null; };
    }, []);

    // ── Update markers and route ───────────────────────────────────────
    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;

        const updateMap = () => {
            // Clear old markers
            markersRef.current.forEach(m => m.remove());
            markersRef.current.clear();

            const pinned = steps.filter(s => s.coordinates);

            pinned.forEach(s => {
                const isActive = s.id === activeStepId;
                const el = document.createElement('div');
                el.className = `flex h-8 w-8 items-center justify-center rounded-full font-black text-xs border-2 border-white shadow-xl transition-all duration-300 cursor-pointer hover:scale-110 ${isActive ? 'bg-[#00ef9d] text-[#0b3a2c] scale-125 z-10' : 'bg-[#0b3a2c] text-white'
                    }`;
                el.innerHTML = `<span>${s.id}</span>`;
                el.onclick = () => onMarkerClick(s.id);

                const marker = new mapboxgl.Marker({ element: el })
                    .setLngLat([s.coordinates!.lng, s.coordinates!.lat])
                    .addTo(map);

                markersRef.current.set(s.id, marker);
            });

            // Update route
            const source = map.getSource('route') as mapboxgl.GeoJSONSource;
            if (source) source.setData(buildGeoJSON(pinned));

            // Fit bounds
            if (pinned.length >= 2) {
                const bounds = new mapboxgl.LngLatBounds();
                pinned.forEach(s => bounds.extend([s.coordinates!.lng, s.coordinates!.lat]));
                map.fitBounds(bounds, { padding: 80, duration: 1000 });
            }
        };

        if (map.loaded()) updateMap();
        else map.on('load', updateMap);
    }, [steps, activeStepId]);

    // ── Center on active step ──────────────────────────────────────────
    useEffect(() => {
        const map = mapRef.current;
        if (!map || activeStepId === null) return;

        const step = steps.find(s => s.id === activeStepId);
        if (step?.coordinates) {
            map.flyTo({
                center: [step.coordinates.lng, step.coordinates.lat],
                zoom: 12,
                duration: 1000
            });
        }
    }, [activeStepId]);

    return <div ref={containerRef} className="h-full w-full" />;
}

function buildGeoJSON(pinned: any[]): any {
    return {
        type: 'FeatureCollection',
        features: [{
            type: 'Feature',
            geometry: {
                type: 'LineString',
                coordinates: pinned.map(s => [s.coordinates.lng, s.coordinates.lat]),
            },
            properties: {},
        }],
    };
}
