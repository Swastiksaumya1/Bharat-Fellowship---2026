import React, { useState } from "react";

export default function LocationDetector({ onLocationDetected }) {
  const [detecting, setDetecting] = useState(false);
  const [error, setError] = useState(null);

  const detectLocation = async () => {
    setDetecting(true);
    setError(null);

    try {
      // Get user's location
      const position = await new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error("Geolocation is not supported by your browser"));
          return;
        }
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          enableHighAccuracy: true
        });
      });

      const { latitude, longitude } = position.coords;

      // Reverse geocode using OpenStreetMap Nominatim
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
        {
          headers: {
            'User-Agent': 'MGNREGA-Performance-Tracker/1.0'
          }
        }
      );

      if (!response.ok) {
        throw new Error("Failed to reverse geocode location");
      }

      const data = await response.json();
      
      // Extract state and district from address
      const address = data.address || {};
      const state = address.state || "";
      const district = address.county || address.state_district || address.city || "";

      if (!state || !district) {
        throw new Error("Could not determine state or district from your location");
      }

      // Notify parent component
      onLocationDetected(state, district);
      
    } catch (err) {
      console.error("Location detection error:", err);
      setError(err.message);
    } finally {
      setDetecting(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={detectLocation}
        disabled={detecting}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
        title="Auto-detect your location"
      >
        {detecting ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Detecting...
          </>
        ) : (
          <>
            <span>📍</span>
            Auto-detect Location
          </>
        )}
      </button>
      
      {error && (
        <div className="absolute top-full mt-2 right-0 bg-red-50 border border-red-200 rounded-lg p-3 shadow-lg z-10 w-64">
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
}

