# 🏛️ MGNREGA Performance Tracker

A mobile-first web application to track and visualize MGNREGA (Mahatma Gandhi National Rural Employment Guarantee Act) performance metrics across districts in India.

**Built for Bharat Fellowship 2026**

## 🎯 Features

- **📊 Real-time Data**: Fetches MGNREGA data from data.gov.in API
- **💾 Smart Caching**: 24-hour cache to ensure reliability even when API is slow
- **📍 Auto-location**: Detect user's district using browser geolocation
- **📈 Visual Analytics**: Interactive charts and graphs using Recharts
- **📱 Mobile-First**: Responsive design optimized for low-bandwidth users
- **🔄 Fallback System**: Serves cached data when API is unavailable

## 🏗️ Architecture

```
┌─────────────┐      ┌─────────────┐      ┌──────────────┐
│   React     │─────▶│   Express   │─────▶│  data.gov.in │
│  Frontend   │      │   Backend   │      │     API      │
│  (Vite)     │◀─────│  (Node.js)  │      └──────────────┘
└─────────────┘      └─────────────┘
                            │
                            ▼
                     ┌─────────────┐
                     │   MongoDB   │
                     │   (Cache)   │
                     └─────────────┘
```

## 📋 Prerequisites

Before you begin, ensure you have:

1. **Docker & Docker Compose** (for one-click setup)
   - OR **Node.js 18+** and **MongoDB** (for manual setup)

2. **data.gov.in API Key**
   - Register at: https://data.gov.in/users/sign_up
   - Get your API key from your profile

3. **MGNREGA Dataset Resource ID**
   - Search for "MGNREGA" on data.gov.in
   - Find the dataset and copy the resource ID from the API example

## 🚀 Quick Start (One-Click with Docker)

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/mgnrega-performance-tracker.git
cd mgnrega-performance-tracker
```

### 2. Configure environment variables

```bash
# Copy the example env file
cp .env.example .env

# Edit .env and add your credentials
# Required variables:
# - DATA_GOV_API_KEY=your_api_key_here
# - DATA_GOV_RESOURCE_ID=your_resource_id_here
```

### 3. Run with Docker Compose

```bash
docker-compose up --build
```

That's it! 🎉

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **MongoDB**: localhost:27017

## 🛠️ Manual Setup (Without Docker)

### Backend Setup

```bash
cd server
npm install
npm run dev
```

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

### MongoDB Setup

Install MongoDB locally or use MongoDB Atlas:
- Local: https://www.mongodb.com/try/download/community
- Atlas: https://www.mongodb.com/cloud/atlas/register

Update `MONGO_URI` in `.env` accordingly.

## 📁 Project Structure

```
mgnrega-performance-tracker/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── DistrictSelector.jsx
│   │   │   ├── LocationDetector.jsx
│   │   │   └── Stats.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── Dockerfile
│   └── package.json
├── server/                # Express backend
│   ├── src/
│   │   ├── controllers/
│   │   │   └── performanceController.js
│   │   ├── models/
│   │   │   └── Performance.js
│   │   ├── routes/
│   │   │   └── performance.js
│   │   └── server.js
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
├── .env.example
└── README.md
```

## 🔑 Environment Variables

Create a `.env` file in the root directory:

```env
# MongoDB Connection
MONGO_URI=mongodb://mongo:27017/mgnrega

# data.gov.in API Credentials
DATA_GOV_API_KEY=YOUR_API_KEY_HERE
DATA_GOV_RESOURCE_ID=YOUR_RESOURCE_ID_HERE

# Server Configuration
NODE_ENV=development
PORT=5000
```

## 🌐 API Endpoints

### Get Performance Data
```
GET /api/performance?state=Uttar Pradesh&district=Varanasi
```

**Response:**
```json
{
  "source": "cache",
  "data": { ... },
  "lastUpdated": "2025-11-01T10:30:00.000Z",
  "cacheAge": "45 minutes"
}
```

### Get Cached Districts
```
GET /api/performance/cached
```

### Health Check
```
GET /health
```

## 🚢 Deployment

### Deploy Backend (Render/Railway)

1. Create a new Web Service
2. Connect your GitHub repository
3. Set build command: `cd server && npm install`
4. Set start command: `cd server && npm start`
5. Add environment variables from `.env`
6. For MongoDB, use MongoDB Atlas and update `MONGO_URI`

### Deploy Frontend (Netlify/Vercel)

1. Create a new site from Git
2. Set build command: `cd client && npm run build`
3. Set publish directory: `client/dist`
4. Add environment variable: `VITE_API_URL=https://your-backend-url.com`

### Production Environment Variables

For production deployment, update:

```env
NODE_ENV=production
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>
VITE_API_URL=https://your-backend-url.com
```

## 📊 Data Source

This application uses the MGNREGA dataset from **data.gov.in**, India's Open Government Data platform.

- **Source**: https://data.gov.in
- **Dataset**: Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA)
- **Update Frequency**: As per government updates
- **Cache Duration**: 24 hours

## 🎥 Loom Video Script (2 minutes)

```
Hi, I'm [Your Name]. This is my MGNREGA District Performance Tracker.

I built a simple, mobile-first interface in React that allows any citizen 
to select their state and district and see key MGNREGA metrics visually.

The backend is Node/Express with MongoDB which caches data from data.gov.in 
so the app works even when the government API is slow or rate-limited.

The frontend uses lightweight charts and icons to avoid heavy reading for 
low-literacy users. I implemented a fallback to auto-detect district via 
browser geolocation and OpenStreetMap reverse geocoding.

The system is containerized and can be run locally with docker-compose up --build.

The repo contains setup, caching logic, and instructions to deploy the 
backend and frontend. Thank you.
```

**What to show in video:**
1. GitHub repo structure (5 seconds)
2. Run `docker-compose up --build` (10 seconds)
3. Demo the app - select district, show data (45 seconds)
4. Show auto-location feature (15 seconds)
5. Open `performanceController.js` to show caching logic (30 seconds)
6. Mention deployment strategy (15 seconds)

## 📝 Submission Checklist

- [ ] Fill `.env` with `DATA_GOV_API_KEY` and `DATA_GOV_RESOURCE_ID`
- [ ] Test API returns expected JSON for a sample district
- [ ] Verify charts display correctly with real data
- [ ] Record 2-minute Loom video
- [ ] Deploy backend to Render/Railway
- [ ] Deploy frontend to Netlify/Vercel
- [ ] Update README with deployed URLs
- [ ] Test deployed application end-to-end
- [ ] Submit Loom link and hosted URL

## 🔧 Troubleshooting

### API returns empty data
- Verify your `DATA_GOV_API_KEY` is correct
- Check the `DATA_GOV_RESOURCE_ID` matches the MGNREGA dataset
- Try a different district that you know has data

### Docker containers won't start
- Ensure ports 5000, 5173, and 27017 are not in use
- Run `docker-compose down` and try again
- Check Docker logs: `docker-compose logs`

### Location detection not working
- Ensure you're using HTTPS (required for geolocation API)
- Grant location permissions in your browser
- Nominatim has usage limits - don't spam requests

## 📄 License

MIT License - feel free to use this project for learning and development.

## 👤 Author

**Swastik Saumya**
- Built for: Bharat Fellowship 2026
- GitHub: [@YOUR_USERNAME](https://github.com/YOUR_USERNAME)

## 🙏 Acknowledgments

- Data source: [data.gov.in](https://data.gov.in)
- Geocoding: [OpenStreetMap Nominatim](https://nominatim.openstreetmap.org)
- Charts: [Recharts](https://recharts.org)

---

**Note**: This is a demonstration project. For production use, implement proper error handling, rate limiting, authentication, and comply with data.gov.in terms of service.
