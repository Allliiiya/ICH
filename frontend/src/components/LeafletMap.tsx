
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import type { Event } from '../types/event';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Reset the default icon URLs (for Vite/Next.js compatibility)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom marker icon
const createCustomIcon = () =>
  L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 20px;
        height: 20px;
        background-color: #c14641;
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      "></div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

interface LeafletMapProps {
  events: Event[];
  className?: string;
}

// Fit to markers
const FitBounds: React.FC<{ events: Event[] }> = ({ events }) => {
  const map = useMap();
  useEffect(() => {
    if (events && events.length > 0) {
      const bounds = L.latLngBounds(
        events.map((e) => {
          const c = getCoordinatesFromLocation(e.location);
          return [c.lat, c.lng] as [number, number];
        }),
      );
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [events, map]);
  return null;
};

// Very simple geocoding
const getCoordinatesFromLocation = (location: string): { lat: number; lng: number } => {
  const defaultCoords = { lat: 40.7128, lng: -74.0060 };
  const locationMap: Record<string, { lat: number; lng: number }> = {
    'new york': { lat: 40.7128, lng: -74.0060 },
    ny: { lat: 40.7128, lng: -74.0060 },
    connecticut: { lat: 41.6032, lng: -73.0877 },
    ct: { lat: 41.6032, lng: -73.0877 },
    'new jersey': { lat: 40.2989, lng: -74.5210 },
    nj: { lat: 40.2989, lng: -74.5210 },
    massachusetts: { lat: 42.4072, lng: -71.3824 },
    ma: { lat: 42.4072, lng: -71.3824 },
    boston: { lat: 42.3601, lng: -71.0589 },
    hartford: { lat: 41.7658, lng: -72.6734 },
    newark: { lat: 40.7357, lng: -74.1724 },
    manhattan: { lat: 40.7831, lng: -73.9712 },
    brooklyn: { lat: 40.6782, lng: -73.9442 },
    queens: { lat: 40.7282, lng: -73.7949 },
    bronx: { lat: 40.8448, lng: -73.8648 },
  };

  const key = location.toLowerCase();
  if (locationMap[key]) return locationMap[key];
  for (const [k, v] of Object.entries(locationMap)) {
    if (key.includes(k) || k.includes(key)) return v;
  }
  return defaultCoords;
};

const LeafletMap: React.FC<LeafletMapProps> = ({ events, className = '' }) => {
  const [isClient, setIsClient] = useState(false);
  const [hoveredEvent, setHoveredEvent] = useState<Event | null>(null);

  useEffect(() => setIsClient(true), []);

  if (!isClient) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`}>
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#c14641] mx-auto mb-4" />
          <div className="text-gray-600">Loading Map...</div>
        </div>
      </div>
    );
  }

  if (events && events.length === 0) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`}>
        <div className="text-center p-8">
          <div className="text-gray-500 text-lg font-semibold mb-2">No Events to Display</div>
          <div className="text-gray-400 text-sm">Select filters to see events on the map</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Map + info panel layout (stack on mobile, side-by-side on lg) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4 items-start">
        {/* Fixed-height map wrapper */}
        <div className="w-full h-80 md:h-96 lg:h-[520px] max-h-[80vh] rounded-lg overflow-hidden">
          <MapContainer
            center={[40.7128, -74.006]}
            zoom={8}
            className="w-full h-full"
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <FitBounds events={events} />

            {events && events.map((event, index) => {
              const coords = getCoordinatesFromLocation(event.location);
              return (
                <Marker
                  key={event.id || index}
                  position={[coords.lat, coords.lng]}
                  icon={createCustomIcon()}
                  riseOnHover
                  eventHandlers={{
                    mouseover: () => setHoveredEvent(event),
                    mouseout: () => setHoveredEvent((prev) => (prev?.id === event.id ? null : prev)),
                    click: () => event.link && window.open(event.link, '_blank'),
                    // keyboard accessibility:
                    focus: () => setHoveredEvent(event),
                    blur: () => setHoveredEvent((prev) => (prev?.id === event.id ? null : prev)),
                  } as any}
                >
                  {/* Hover tooltip (shows immediately, follows cursor) */}
                  <Tooltip direction="top" offset={[0, -6]} sticky>
                    <div className="text-xs leading-tight">
                      <div className="font-semibold text-[#c14641]">{event.name}</div>
                      <div className="text-gray-700">
                        {event.location} • {event.date}
                      </div>
                    </div>
                  </Tooltip>

                  {/* Keep popup for click-through actions */}
                  <Popup>
                    <div className="p-2 max-w-xs">
                      <h3 className="font-semibold text-sm text-[#c14641] mb-2">{event.name}</h3>
                      <p className="text-xs text-gray-600 mb-1">
                        <strong>Location:</strong> {event.location}
                      </p>
                      <p className="text-xs text-gray-600 mb-1">
                        <strong>Date:</strong> {event.date}
                      </p>
                      <p className="text-xs text-gray-600 mb-2">{event.description}</p>
                      {event.link && (
                        <button
                          onClick={() => window.open(event.link!, '_blank')}
                          className="bg-[#c14641] text-white text-xs px-3 py-1 rounded hover:bg-[#a13e2e] transition-colors"
                        >
                          View Details
                        </button>
                      )}
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>

        {/* Rich info card that updates on hover */}
        <aside
          aria-live="polite"
          className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm min-h-[120px]"
        >
          {hoveredEvent ? (
            <div className="space-y-2">
              <div className="text-sm text-gray-500">Hovered Event</div>
              <h4 className="text-base font-semibold text-[#c14641]">{hoveredEvent.name}</h4>
              <div className="text-sm text-gray-700">
                <div>
                  <strong>Location:</strong> {hoveredEvent.location}
                </div>
                <div>
                  <strong>Date:</strong> {hoveredEvent.date}
                </div>
              </div>
              {hoveredEvent.description && (
                <p className="text-sm text-gray-600">{hoveredEvent.description}</p>
              )}
              {
              // hoveredEvent.link && (
              //   <a
              //     href={hoveredEvent.link}
              //     target="_blank"
              //     rel="noreferrer"
              //     className="inline-block text-xs font-medium text-white bg-[#c14641] px-3 py-1 rounded hover:bg-[#a13e2e]"
              //   >
              //     View Details
              //   </a>
              // )
              }
            </div>
          ) : (
            <div className="text-sm text-gray-500">Hover a marker to preview its details.</div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default LeafletMap;