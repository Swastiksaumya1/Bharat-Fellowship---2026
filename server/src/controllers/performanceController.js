import axios from "axios";
import Performance from "../models/Performance.js";

const API_KEY = process.env.DATA_GOV_API_KEY;
const RESOURCE_ID = process.env.DATA_GOV_RESOURCE_ID;
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Get MGNREGA performance data for a district
 * Uses caching to reduce API calls and improve reliability
 */
export async function getPerformance(req, res) {
  try {
    const { state = "Uttar Pradesh", district } = req.query;

    if (!district) {
      return res.status(400).json({
        message: "district query parameter is required",
        example: "/api/performance?state=Uttar Pradesh&district=Varanasi",
      });
    }

    // Create cache key
    const cacheKey = `${state}::${district}`.toLowerCase();

    // Check cache first
    const cached = await Performance.findOne({ district: cacheKey });
    const now = Date.now();

    // Return cached data if fresh (less than 24 hours old)
    if (
      cached &&
      now - new Date(cached.lastUpdated).getTime() < CACHE_DURATION_MS
    ) {
      console.log(`✅ Cache hit for ${state} - ${district}`);
      return res.json({
        source: "cache",
        data: cached.data,
        lastUpdated: cached.lastUpdated,
        cacheAge:
          Math.floor(
            (now - new Date(cached.lastUpdated).getTime()) / 1000 / 60
          ) + " minutes",
      });
    }

    console.log(`🌐 Fetching fresh data for ${state} - ${district}`);

    // Validate API credentials
    if (!API_KEY || !RESOURCE_ID || API_KEY === "test_api_key") {
      console.log("⚠️ Using demo data (API credentials not configured)");
      // Try to return stale cache if available
      if (cached) {
        return res.json({
          source: "cache",
          data: cached.data,
          warning: "API credentials not configured, serving cached data",
          lastUpdated: cached.lastUpdated,
        });
      }

      // Return demo data for testing
      const demoData = {
        records: [
          {
            state_name: state,
            district_name: district,
            total_workers: "125000",
            total_wages_paid: "₹45,00,00,000",
            total_projects: "850",
            total_work_days: "2,50,000",
            financial_year: "2023-24",
            month: "October",
          },
          {
            state_name: state,
            district_name: district,
            total_workers: "118000",
            total_wages_paid: "₹42,00,00,000",
            total_projects: "820",
            total_work_days: "2,35,000",
            financial_year: "2023-24",
            month: "September",
          },
          {
            state_name: state,
            district_name: district,
            total_workers: "132000",
            total_wages_paid: "₹48,00,00,000",
            total_projects: "880",
            total_work_days: "2,65,000",
            financial_year: "2023-24",
            month: "August",
          },
        ],
        total: 3,
        count: 3,
      };

      // Cache the demo data
      await Performance.create({
        district: cacheKey,
        state,
        data: demoData,
        lastUpdated: new Date(),
      });

      return res.json({
        source: "demo",
        data: demoData,
        warning:
          "Using demo data. Configure DATA_GOV_API_KEY to fetch real data.",
        lastUpdated: new Date(),
      });
    }

    // Build data.gov.in API URL
    const apiUrl = `https://api.data.gov.in/resource/${RESOURCE_ID}`;
    const params = {
      "api-key": API_KEY,
      format: "json",
      limit: 100,
    };

    // Add filters for state and district
    params[`filters[state_name]`] = state;
    params[`filters[district_name]`] = district;

    // Make API request
    const { data: apiResponse } = await axios.get(apiUrl, {
      params,
      timeout: 15000,
      headers: {
        "User-Agent": "MGNREGA-Performance-Tracker/1.0",
      },
    });

    const payload = apiResponse || {};

    console.log(`✅ API response received for ${state} - ${district}`);

    // Update or create cache entry
    if (cached) {
      cached.data = payload;
      cached.lastUpdated = new Date();
      await cached.save();
      console.log(`💾 Cache updated for ${cacheKey}`);
    } else {
      await Performance.create({
        district: cacheKey,
        state,
        data: payload,
        lastUpdated: new Date(),
      });
      console.log(`💾 Cache created for ${cacheKey}`);
    }

    return res.json({
      source: "api",
      data: payload,
      lastUpdated: new Date(),
    });
  } catch (err) {
    console.error("❌ Error in getPerformance:", err.message || err);

    // Fallback to cache on error
    const state = req.query.state || "Uttar Pradesh";
    const district = req.query.district || "";
    const cacheKey = `${state}::${district}`.toLowerCase();

    try {
      const cached = await Performance.findOne({ district: cacheKey });
      if (cached) {
        console.log(`⚠️ Serving stale cache due to API error for ${cacheKey}`);
        return res.json({
          source: "cache",
          data: cached.data,
          warning: "Served from cache due to API error",
          error: err.message,
          lastUpdated: cached.lastUpdated,
        });
      }
    } catch (dbErr) {
      console.error("❌ Database error:", dbErr);
    }

    return res.status(500).json({
      message: "Failed to fetch data",
      error: err.message,
      details: err.response?.data || null,
    });
  }
}

/**
 * Get list of all cached districts
 */
export async function getCachedDistricts(req, res) {
  try {
    const cached = await Performance.find(
      {},
      { district: 1, state: 1, lastUpdated: 1 }
    ).sort({ lastUpdated: -1 });
    res.json({
      count: cached.length,
      districts: cached.map((c) => ({
        state: c.state,
        district: c.district,
        lastUpdated: c.lastUpdated,
      })),
    });
  } catch (err) {
    console.error("Error fetching cached districts:", err);
    res.status(500).json({ message: "Failed to fetch cached districts" });
  }
}
