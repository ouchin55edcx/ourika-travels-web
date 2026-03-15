'use client';
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

type StepCoords = {
    id: number;
    title: string;
    shortLabel?: string;
    coordinates?: { lng: number; lat: number };
};

type Props = {
    steps: StepCoords[];
    pickingStepId: number | null;
    onPinPlaced: (stepId: number, coords: { lng: number; lat: number }) => void;
};

export default function MapboxItineraryMap({ steps, pickingStepId, onPinPlaced }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const markersRef = useRef<mapboxgl.Marker[]>([]);

    // ── Init map once ──────────────────────────────────────────────────
    useEffect(() => {
        if (!containerRef.current || mapRef.current) return;
        mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

        mapRef.current = new mapboxgl.Map({
            container: containerRef.current,
            style: 'mapbox://styles/mapbox/outdoors-v12',
            center: [-7.9811, 31.6295],  // Marrakech
            zoom: 9,
            attributionControl: false,
        });

        mapRef.current.addControl(
            new mapboxgl.AttributionControl({ compact: true }), 'bottom-left');
        mapRef.current.addControl(
            new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-right');

        const map = mapRef.current;

        map.on('load', () => {
            map.addSource('route', {
                type: 'geojson',
                data: buildGeoJSON([]),
            });
            map.addLayer({
                id: 'route-line',
                type: 'line',
                source: 'route',
                paint: {
                    'line-color': '#003b1f',
                    'line-width': 3,
                    'line-dasharray': [2, 1.5],
                },
            });
        });

        return () => {
            mapRef.current?.remove();
            mapRef.current = null;
        };
    }, []);

    // ── Map click handler for picking mode ────────────────────────────
    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;

        if (pickingStepId !== null) {
            map.getCanvas().style.cursor = 'crosshair';
            const onClick = (e: mapboxgl.MapMouseEvent) => {
                onPinPlaced(pickingStepId, { lng: e.lngLat.lng, lat: e.lngLat.lat });
                map.getCanvas().style.cursor = '';
            };
            map.once('click', onClick);
            return () => {
                map.off('click', onClick);
                map.getCanvas().style.cursor = '';
            };
        } else {
            map.getCanvas().style.cursor = '';
        }
    }, [pickingStepId, onPinPlaced]);

    // ── Update markers + route whenever steps change ──────────────────
    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;

        const updateMarkers = () => {
            // Clear old markers
            markersRef.current.forEach(m => m.remove());
            markersRef.current = [];

            const pinned = steps.filter(s => s.coordinates);

            pinned.forEach(s => {
                const el = document.createElement('div');
                el.className = 'flex h-8 w-8 items-center justify-center rounded-full bg-[#0b3a2c] text-white font-black text-xs border-2 border-white shadow-xl cursor-default';
                el.innerHTML = `<span>${s.id}</span>`;

                const popup = new mapboxgl.Popup({ offset: 25, closeButton: false, closeOnClick: false })
                    .setText(s.shortLabel || s.title);

                const marker = new mapboxgl.Marker({ element: el })
                    .setLngLat([s.coordinates!.lng, s.coordinates!.lat])
                    .setPopup(popup)
                    .addTo(map);

                markersRef.current.push(marker);
            });

            // Update route line
            if (map.getSource('route')) {
                (map.getSource('route') as mapboxgl.GeoJSONSource).setData(buildGeoJSON(pinned));
            }

            // Fit bounds
            if (pinned.length >= 2) {
                const bounds = new mapboxgl.LngLatBounds();
                pinned.forEach(s => bounds.extend([s.coordinates!.lng, s.coordinates!.lat]));
                map.fitBounds(bounds, { padding: 60, duration: 800, maxZoom: 13 });
            } else if (pinned.length === 1) {
                map.flyTo({
                    center: [pinned[0].coordinates!.lng, pinned[0].coordinates!.lat],
                    zoom: 12, duration: 800
                });
            }
        };

        if (map.loaded()) {
            updateMarkers();
        } else {
            map.on('load', updateMarkers);
        }
    }, [steps]);

    return (
        <div className="relative h-full w-full overflow-hidden rounded-[2.5rem] bg-gray-100 shadow-inner">
            <div ref={containerRef} className="h-full w-full" />

            {/* Picking mode overlay banner */}
            {pickingStepId !== null && (
                <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10">
                    <div className="flex items-center gap-2 rounded-full bg-[#0b3a2c] px-6 py-2.5 text-sm font-bold text-white shadow-2xl animate-bounce">
                        📍 Click the map to place pin for Stop {steps.find(s => s.id === pickingStepId)?.id}
                    </div>
                </div>
            )}
        </div>
    );
}

function buildGeoJSON(steps: StepCoords[]): any {
    return {
        type: 'FeatureCollection',
        features: [{
            type: 'Feature',
            geometry: {
                type: 'LineString',
                coordinates: steps
                    .filter(s => s.coordinates)
                    .map(s => [s.coordinates!.lng, s.coordinates!.lat]),
            },
            properties: {},
        }],
    };
}
