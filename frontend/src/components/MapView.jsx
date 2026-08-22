import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import PriorityBadge from './PriorityBadge';
import 'leaflet/dist/leaflet.css';

export default function MapView({ hotspots }) {
  const getMarkerColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'critical': return '#ef4444';
      case 'high': return '#f97316';
      case 'medium': return '#eab308';
      default: return '#3b82f6';
    }
  };

  if (!hotspots || hotspots.length === 0) {
    return (
      <div className="h-64 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center">
        <span className="text-gray-400">No hotspot data available for map display.</span>
      </div>
    );
  }

  // Calculate rough center based on first hotspot or default to Delhi
  const center = hotspots.length > 0 ? [hotspots[0].lat, hotspots[0].lng] : [28.6139, 77.2090];

  return (
    <div className="h-80 rounded-lg overflow-hidden border border-gray-200 relative z-0">
      <MapContainer 
        center={center} 
        zoom={10} 
        style={{ height: "100%", width: "100%" }}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
        {hotspots.map(spot => (
          <CircleMarker
            key={spot.id}
            center={[spot.lat, spot.lng]}
            radius={Math.max(8, (spot.score || 50) / 5)}
            fillColor={getMarkerColor(spot.priority)}
            color={getMarkerColor(spot.priority)}
            weight={1}
            opacity={1}
            fillOpacity={0.7}
          >
            <Popup>
              <div className="p-2 min-w-[150px]">
                <h4 className="font-bold text-gray-900 mb-1">{spot.title || spot.category}</h4>
                <div className="text-sm text-gray-600 mb-2">{spot.district}</div>
                <div className="flex justify-between items-center text-sm border-t pt-2 mt-2">
                  <span className="text-gray-500">Priority:</span>
                  <PriorityBadge level={spot.priority} className="!py-0 !px-2" />
                </div>
                <div className="flex justify-between items-center text-sm mt-1">
                  <span className="text-gray-500">Requests:</span>
                  <span className="font-medium text-gray-900">{spot.requests}</span>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
