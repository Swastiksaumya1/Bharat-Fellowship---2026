@echo off
REM MGNREGA Performance Tracker - API Test Script (Windows)
REM This script tests the backend API endpoints

echo.
echo Testing MGNREGA Performance Tracker API
echo ==========================================
echo.

REM Default to localhost
set API_URL=http://localhost:5000
if not "%1"=="" set API_URL=%1

echo Testing API at: %API_URL%
echo.

REM Test 1: Health Check
echo Test 1: Health Check
echo --------------------
curl -s "%API_URL%/health"
echo.
echo.

REM Test 2: Performance API without parameters
echo Test 2: Performance API (missing district parameter)
echo ---------------------------------------------------
curl -s "%API_URL%/api/performance"
echo.
echo.

REM Test 3: Performance API with valid parameters
echo Test 3: Performance API (Uttar Pradesh - Varanasi)
echo -------------------------------------------------
curl -s "%API_URL%/api/performance?state=Uttar%%20Pradesh&district=Varanasi"
echo.
echo.

REM Test 4: Cached districts endpoint
echo Test 4: Cached Districts List
echo -----------------------------
curl -s "%API_URL%/api/performance/cached"
echo.
echo.

REM Summary
echo ==========================================
echo Test Summary
echo ==========================================
echo.
echo If you see JSON responses above, your API is working!
echo.
echo Next steps:
echo 1. Open http://localhost:5173 in your browser
echo 2. Select a state and district
echo 3. Click 'Show Data' to see the results
echo.
echo To test deployed API, run:
echo   test-api.bat https://your-backend-url.com
echo.
pause

