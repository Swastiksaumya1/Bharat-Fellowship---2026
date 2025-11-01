import React, { useState, useEffect } from "react";
import DistrictSelector from "./components/DistrictSelector";
import Stats from "./components/Stats";
import LocationDetector from "./components/LocationDetector";

export default function App() {
  const [district, setDistrict] = useState("Varanasi");
  const [stateName, setStateName] = useState("Uttar Pradesh");
  const [data, setData] = useState(null);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  async function fetchData() {
    setLoading(true);
    setError(null);
    
    try {
      const url = `${API_URL}/api/performance?state=${encodeURIComponent(stateName)}&district=${encodeURIComponent(district)}`;
      const res = await fetch(url);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const json = await res.json();
      setMeta({
        source: json.source || "unknown",
        lastUpdated: json.lastUpdated,
        warning: json.warning,
        cacheAge: json.cacheAge
      });
      setData(json.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleLocationDetected = (detectedState, detectedDistrict) => {
    setStateName(detectedState);
    setDistrict(detectedDistrict);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🏛️ MGNREGA Performance Tracker
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Track employment guarantee scheme metrics across India
              </p>
            </div>
            <LocationDetector onLocationDetected={handleLocationDetected} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <DistrictSelector
          district={district}
          setDistrict={setDistrict}
          stateName={stateName}
          setStateName={setStateName}
          fetchData={fetchData}
          loading={loading}
        />

        {/* Metadata */}
        {meta && (
          <div className="mt-4 bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-2">
                  <span className={`inline-block w-2 h-2 rounded-full ${meta.source === 'api' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                  <span className="text-gray-600">
                    Source: <span className="font-semibold">{meta.source}</span>
                  </span>
                </span>
                {meta.cacheAge && (
                  <span className="text-gray-500">
                    Cache age: {meta.cacheAge}
                  </span>
                )}
              </div>
              {meta.lastUpdated && (
                <span className="text-gray-500">
                  Updated: {new Date(meta.lastUpdated).toLocaleString()}
                </span>
              )}
            </div>
            {meta.warning && (
              <div className="mt-2 text-sm text-amber-600 bg-amber-50 p-2 rounded">
                ⚠️ {meta.warning}
              </div>
            )}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-red-500 text-xl">❌</span>
              <div>
                <h3 className="font-semibold text-red-800">Error Loading Data</h3>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="mt-8 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Loading data...</p>
          </div>
        )}

        {/* Data Display */}
        {!loading && data && <Stats data={data} district={district} state={stateName} />}

        {/* Empty State */}
        {!loading && !data && !error && (
          <div className="mt-12 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              No data loaded yet
            </h2>
            <p className="text-gray-600">
              Select a state and district, then click "Show Data" to view MGNREGA metrics
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-gray-600">
          <p>
            Data sourced from{" "}
            <a
              href="https://data.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline"
            >
              data.gov.in
            </a>
          </p>
          <p className="mt-2">
            Built for Bharat Fellowship 2026 by Swastik Saumya
          </p>
        </div>
      </footer>
    </div>
  );
}

