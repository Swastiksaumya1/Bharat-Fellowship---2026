# 📡 API Documentation

Complete API reference for the MGNREGA Performance Tracker backend.

## Base URL

- **Local Development**: `http://localhost:5000`
- **Production**: `https://your-backend-url.com`

## Authentication

No authentication required for read operations. API uses data.gov.in credentials configured on the server.

## Endpoints

### 1. Health Check

Check if the API server is running.

**Endpoint**: `GET /health`

**Response**:
```json
{
  "status": "ok",
  "timestamp": "2025-11-01T10:30:00.000Z"
}
```

**Status Codes**:
- `200 OK`: Server is healthy

**Example**:
```bash
curl http://localhost:5000/health
```

---

### 2. Get Performance Data

Retrieve MGNREGA performance data for a specific district.

**Endpoint**: `GET /api/performance`

**Query Parameters**:
| Parameter | Type   | Required | Default         | Description                    |
|-----------|--------|----------|-----------------|--------------------------------|
| state     | string | No       | Uttar Pradesh   | Name of the state              |
| district  | string | Yes      | -               | Name of the district           |

**Response**:
```json
{
  "source": "cache",
  "data": {
    "records": [
      {
        "state_name": "Uttar Pradesh",
        "district_name": "Varanasi",
        "total_workers": "125000",
        "total_wages": "5000000",
        "total_projects": "450",
        "financial_year": "2023-24"
      }
    ],
    "total": 1,
    "count": 1
  },
  "lastUpdated": "2025-11-01T10:30:00.000Z",
  "cacheAge": "45 minutes"
}
```

**Response Fields**:
| Field       | Type   | Description                                    |
|-------------|--------|------------------------------------------------|
| source      | string | Data source: "api" (fresh) or "cache" (cached) |
| data        | object | MGNREGA data from data.gov.in                  |
| lastUpdated | string | ISO timestamp of last data update              |
| cacheAge    | string | Human-readable cache age (if from cache)      |
| warning     | string | Warning message (if any issues)                |

**Status Codes**:
- `200 OK`: Data retrieved successfully
- `400 Bad Request`: Missing required parameters
- `500 Internal Server Error`: Server or API error

**Examples**:

```bash
# Basic request
curl "http://localhost:5000/api/performance?district=Varanasi"

# With state parameter
curl "http://localhost:5000/api/performance?state=Bihar&district=Patna"

# URL-encoded spaces
curl "http://localhost:5000/api/performance?state=Uttar%20Pradesh&district=Varanasi"
```

**Caching Behavior**:
- Data is cached for **24 hours**
- Fresh data is fetched from data.gov.in if cache is expired
- If API fails, stale cache is served with a warning
- Cache key is based on state and district (case-insensitive)

**Error Response**:
```json
{
  "message": "district query parameter is required",
  "example": "/api/performance?state=Uttar Pradesh&district=Varanasi"
}
```

---

### 3. Get Cached Districts

Retrieve list of all districts currently in cache.

**Endpoint**: `GET /api/performance/cached`

**Response**:
```json
{
  "count": 5,
  "districts": [
    {
      "state": "Uttar Pradesh",
      "district": "uttar pradesh::varanasi",
      "lastUpdated": "2025-11-01T10:30:00.000Z"
    },
    {
      "state": "Bihar",
      "district": "bihar::patna",
      "lastUpdated": "2025-11-01T09:15:00.000Z"
    }
  ]
}
```

**Status Codes**:
- `200 OK`: List retrieved successfully
- `500 Internal Server Error`: Database error

**Example**:
```bash
curl http://localhost:5000/api/performance/cached
```

---

## Data Structure

### MGNREGA Data Fields

The actual fields in the `data.records` array depend on the data.gov.in dataset. Common fields include:

| Field Name          | Type   | Description                           |
|---------------------|--------|---------------------------------------|
| state_name          | string | Name of the state                     |
| district_name       | string | Name of the district                  |
| block_name          | string | Name of the block (if available)      |
| financial_year      | string | Financial year (e.g., "2023-24")      |
| total_workers       | number | Total number of workers               |
| total_wages         | number | Total wages paid (in rupees)          |
| total_projects      | number | Total number of projects              |
| persondays          | number | Total person-days of work             |
| households          | number | Number of households benefited        |
| expenditure         | number | Total expenditure (in rupees)         |

**Note**: Field names may vary depending on the specific MGNREGA dataset resource ID used.

---

## Rate Limiting

- No rate limiting on the backend API
- However, data.gov.in API has rate limits (typically 100 requests/hour)
- Caching helps avoid hitting data.gov.in rate limits

---

## Error Handling

### Common Errors

#### 1. Missing District Parameter
```json
{
  "message": "district query parameter is required",
  "example": "/api/performance?state=Uttar Pradesh&district=Varanasi"
}
```

#### 2. API Configuration Error
```json
{
  "message": "Server configuration error: API credentials missing"
}
```

#### 3. API Request Failed
```json
{
  "source": "cache",
  "data": { ... },
  "warning": "Served from cache due to API error",
  "error": "Request timeout"
}
```

#### 4. No Data Available
```json
{
  "source": "api",
  "data": {
    "records": [],
    "total": 0
  }
}
```

---

## Integration Examples

### JavaScript (Fetch API)

```javascript
async function getDistrictData(state, district) {
  const url = `http://localhost:5000/api/performance?state=${encodeURIComponent(state)}&district=${encodeURIComponent(district)}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

// Usage
getDistrictData('Uttar Pradesh', 'Varanasi')
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

### Python (Requests)

```python
import requests

def get_district_data(state, district):
    url = "http://localhost:5000/api/performance"
    params = {
        "state": state,
        "district": district
    }
    
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        return None

# Usage
data = get_district_data("Uttar Pradesh", "Varanasi")
if data:
    print(f"Source: {data['source']}")
    print(f"Records: {len(data['data'].get('records', []))}")
```

### cURL

```bash
# Basic request
curl -X GET "http://localhost:5000/api/performance?state=Uttar%20Pradesh&district=Varanasi"

# With headers
curl -X GET \
  -H "Accept: application/json" \
  "http://localhost:5000/api/performance?state=Bihar&district=Patna"

# Save to file
curl -X GET "http://localhost:5000/api/performance?district=Varanasi" \
  -o response.json

# Pretty print with jq
curl -s "http://localhost:5000/api/performance?district=Varanasi" | jq .
```

---

## CORS Configuration

The API allows cross-origin requests from all domains:

```javascript
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

---

## Performance Considerations

1. **Caching**: Data is cached for 24 hours to reduce API calls
2. **Timeout**: API requests to data.gov.in timeout after 15 seconds
3. **Fallback**: Stale cache is served if fresh data fetch fails
4. **Database Indexing**: MongoDB indexes on state and district for fast queries

---

## Monitoring

### Check API Health

```bash
# Simple health check
curl http://localhost:5000/health

# Check if data can be fetched
curl "http://localhost:5000/api/performance?district=Varanasi"

# Check cache status
curl http://localhost:5000/api/performance/cached
```

### Logs

Server logs include:
- ✅ Cache hits
- 🌐 API requests to data.gov.in
- 💾 Cache updates
- ❌ Errors and warnings

---

## Support

For issues or questions:
1. Check the [README.md](README.md) troubleshooting section
2. Review server logs: `docker-compose logs server`
3. Test API directly with curl
4. Verify environment variables are set correctly

---

**Last Updated**: 2025-11-01

