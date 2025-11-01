#!/bin/bash

# MGNREGA Performance Tracker - API Test Script
# This script tests the backend API endpoints

echo "🧪 Testing MGNREGA Performance Tracker API"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default to localhost, but allow override
API_URL="${1:-http://localhost:5000}"

echo "Testing API at: $API_URL"
echo ""

# Test 1: Health Check
echo "Test 1: Health Check"
echo "--------------------"
HEALTH_RESPONSE=$(curl -s -w "\n%{http_code}" "$API_URL/health")
HTTP_CODE=$(echo "$HEALTH_RESPONSE" | tail -n1)
BODY=$(echo "$HEALTH_RESPONSE" | head -n-1)

if [ "$HTTP_CODE" -eq 200 ]; then
    echo -e "${GREEN}✅ PASSED${NC} - Health check successful"
    echo "Response: $BODY"
else
    echo -e "${RED}❌ FAILED${NC} - Health check failed (HTTP $HTTP_CODE)"
    echo "Response: $BODY"
fi
echo ""

# Test 2: Performance API without parameters
echo "Test 2: Performance API (missing district parameter)"
echo "---------------------------------------------------"
PERF_RESPONSE=$(curl -s -w "\n%{http_code}" "$API_URL/api/performance")
HTTP_CODE=$(echo "$PERF_RESPONSE" | tail -n1)
BODY=$(echo "$PERF_RESPONSE" | head -n-1)

if [ "$HTTP_CODE" -eq 400 ]; then
    echo -e "${GREEN}✅ PASSED${NC} - Correctly returns 400 for missing parameter"
    echo "Response: $BODY"
else
    echo -e "${YELLOW}⚠️  WARNING${NC} - Expected 400, got HTTP $HTTP_CODE"
    echo "Response: $BODY"
fi
echo ""

# Test 3: Performance API with valid parameters
echo "Test 3: Performance API (Uttar Pradesh - Varanasi)"
echo "-------------------------------------------------"
PERF_RESPONSE=$(curl -s -w "\n%{http_code}" "$API_URL/api/performance?state=Uttar%20Pradesh&district=Varanasi")
HTTP_CODE=$(echo "$PERF_RESPONSE" | tail -n1)
BODY=$(echo "$PERF_RESPONSE" | head -n-1)

if [ "$HTTP_CODE" -eq 200 ]; then
    echo -e "${GREEN}✅ PASSED${NC} - Performance data retrieved"
    echo "Response preview:"
    echo "$BODY" | head -c 500
    echo "..."
    
    # Check if response contains expected fields
    if echo "$BODY" | grep -q "source"; then
        echo -e "${GREEN}✅${NC} Contains 'source' field"
    fi
    if echo "$BODY" | grep -q "data"; then
        echo -e "${GREEN}✅${NC} Contains 'data' field"
    fi
else
    echo -e "${RED}❌ FAILED${NC} - Performance API failed (HTTP $HTTP_CODE)"
    echo "Response: $BODY"
fi
echo ""

# Test 4: Cached districts endpoint
echo "Test 4: Cached Districts List"
echo "-----------------------------"
CACHED_RESPONSE=$(curl -s -w "\n%{http_code}" "$API_URL/api/performance/cached")
HTTP_CODE=$(echo "$CACHED_RESPONSE" | tail -n1)
BODY=$(echo "$CACHED_RESPONSE" | head -n-1)

if [ "$HTTP_CODE" -eq 200 ]; then
    echo -e "${GREEN}✅ PASSED${NC} - Cached districts retrieved"
    echo "Response: $BODY"
else
    echo -e "${YELLOW}⚠️  WARNING${NC} - Cached districts endpoint returned HTTP $HTTP_CODE"
    echo "Response: $BODY"
fi
echo ""

# Test 5: Different district
echo "Test 5: Performance API (Bihar - Patna)"
echo "---------------------------------------"
PERF_RESPONSE=$(curl -s -w "\n%{http_code}" "$API_URL/api/performance?state=Bihar&district=Patna")
HTTP_CODE=$(echo "$PERF_RESPONSE" | tail -n1)

if [ "$HTTP_CODE" -eq 200 ]; then
    echo -e "${GREEN}✅ PASSED${NC} - Different district works"
else
    echo -e "${YELLOW}⚠️  WARNING${NC} - HTTP $HTTP_CODE (might be no data for this district)"
fi
echo ""

# Summary
echo "=========================================="
echo "🏁 Test Summary"
echo "=========================================="
echo ""
echo "If all tests passed, your API is working correctly!"
echo ""
echo "Next steps:"
echo "1. Open http://localhost:5173 in your browser"
echo "2. Select a state and district"
echo "3. Click 'Show Data' to see the results"
echo ""
echo "To test deployed API, run:"
echo "  ./test-api.sh https://your-backend-url.com"
echo ""

