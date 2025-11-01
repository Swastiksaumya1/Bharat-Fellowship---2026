import express from "express";
import { getPerformance, getCachedDistricts } from "../controllers/performanceController.js";

const router = express.Router();

// Get performance data for a specific district
router.get("/", getPerformance);

// Get list of all cached districts
router.get("/cached", getCachedDistricts);

export default router;
 
