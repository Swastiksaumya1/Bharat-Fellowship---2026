# 📋 Bharat Fellowship 2026 - Submission Guide

## Complete Step-by-Step Submission Instructions

### Step 1: Get API Credentials (15 minutes)

#### 1.1 Register on data.gov.in
1. Go to https://data.gov.in/users/sign_up
2. Fill in your details and create an account
3. Verify your email address
4. Log in to your account

#### 1.2 Get Your API Key
1. Click on your profile (top-right corner)
2. Go to "My Account" or "API Keys"
3. Copy your API key (looks like: `579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b`)
4. Save it in a secure place

#### 1.3 Find the MGNREGA Resource ID
1. Go to https://data.gov.in
2. Search for "MGNREGA" or "Mahatma Gandhi National Rural Employment Guarantee"
3. Click on the dataset (usually titled "MGNREGA - State/District wise data")
4. Scroll down to "API Details" or "Resource Information"
5. Copy the Resource ID (looks like: `9ef84268-d588-465a-a308-a864a43d0070`)
6. Alternative: Look at the API example URL on the page - the resource ID is in the URL

**Example API URL structure:**
```
https://api.data.gov.in/resource/[RESOURCE_ID]?api-key=[YOUR_API_KEY]&format=json
```

### Step 2: Setup Project Locally (10 minutes)

#### 2.1 Clone and Configure
```bash
# Clone your repo
git clone https://github.com/YOUR_USERNAME/mgnrega-performance-tracker.git
cd mgnrega-performance-tracker

# Create .env file
cp .env.example .env
```

#### 2.2 Edit .env File
Open `.env` in a text editor and fill in:

```env
MONGO_URI=mongodb://mongo:27017/mgnrega
DATA_GOV_API_KEY=579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b
DATA_GOV_RESOURCE_ID=9ef84268-d588-465a-a308-a864a43d0070
NODE_ENV=development
PORT=5000
```

**Replace with your actual values!**

#### 2.3 Test Locally with Docker
```bash
# Start all services
docker-compose up --build

# Wait for services to start (1-2 minutes)
# You should see:
# ✅ MongoDB connected successfully
# 🚀 Server listening on port 5000
```

#### 2.4 Test the Application
1. Open browser: http://localhost:5173
2. Select a state and district (e.g., Uttar Pradesh - Varanasi)
3. Click "Show Data"
4. Verify data loads and charts display

**If you see errors:**
- Check your API key is correct
- Try a different district
- Check Docker logs: `docker-compose logs server`

### Step 3: Test API Directly (5 minutes)

Before deploying, test the API manually:

```bash
# Test with curl (replace with your actual values)
curl "http://localhost:5000/api/performance?state=Uttar%20Pradesh&district=Varanasi"
```

**Expected response:**
```json
{
  "source": "api",
  "data": {
    "records": [...]
  },
  "lastUpdated": "2025-11-01T..."
}
```

### Step 4: Deploy Backend (20 minutes)

#### Option A: Deploy to Render.com

1. **Create MongoDB Atlas Database** (if not using local)
   - Go to https://www.mongodb.com/cloud/atlas/register
   - Create free cluster
   - Get connection string (looks like: `mongodb+srv://user:pass@cluster.mongodb.net/mgnrega`)

2. **Deploy to Render**
   - Go to https://render.com
   - Sign up/Login with GitHub
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `mgnrega-backend`
     - **Root Directory**: `server`
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
   - Add Environment Variables:
     ```
     MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/mgnrega
     DATA_GOV_API_KEY=your_api_key
     DATA_GOV_RESOURCE_ID=your_resource_id
     NODE_ENV=production
     PORT=5000
     ```
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Copy your backend URL (e.g., `https://mgnrega-backend.onrender.com`)

3. **Test Deployed Backend**
   ```bash
   curl "https://mgnrega-backend.onrender.com/health"
   curl "https://mgnrega-backend.onrender.com/api/performance?state=Uttar%20Pradesh&district=Varanasi"
   ```

#### Option B: Deploy to Railway.app

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Add MongoDB service: "New" → "Database" → "MongoDB"
6. Configure server service:
   - Root directory: `server`
   - Add environment variables (same as above)
7. Deploy and copy URL

### Step 5: Deploy Frontend (15 minutes)

#### Option A: Deploy to Netlify

1. **Prepare for Deployment**
   - Go to https://netlify.com
   - Sign up/Login with GitHub

2. **Deploy**
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub and select your repository
   - Configure:
     - **Base directory**: `client`
     - **Build command**: `npm run build`
     - **Publish directory**: `client/dist`
   - Add Environment Variable:
     ```
     VITE_API_URL=https://mgnrega-backend.onrender.com
     ```
   - Click "Deploy site"
   - Wait for deployment (3-5 minutes)
   - Copy your frontend URL (e.g., `https://mgnrega-tracker.netlify.app`)

3. **Test Deployed Frontend**
   - Open the URL in browser
   - Test selecting district and loading data
   - Test auto-location feature (requires HTTPS)

#### Option B: Deploy to Vercel

1. Go to https://vercel.com
2. Import your GitHub repository
3. Configure:
   - Framework Preset: Vite
   - Root Directory: `client`
   - Environment Variables: `VITE_API_URL=https://your-backend-url.com`
4. Deploy

### Step 6: Record Loom Video (10 minutes)

#### 6.1 Install Loom
- Go to https://www.loom.com
- Sign up for free account
- Install Loom desktop app or Chrome extension

#### 6.2 Prepare Your Recording
Open these tabs before recording:
1. Your GitHub repository
2. Your deployed frontend URL
3. VS Code with `server/src/controllers/performanceController.js` open

#### 6.3 Record (2 minutes max)

**Script to follow:**

```
[0:00-0:10] Introduction
"Hi, I'm [Your Name]. This is my MGNREGA District Performance Tracker 
built for the Bharat Fellowship 2026."

[0:10-0:30] Show GitHub Repo
"Here's my GitHub repository with the complete source code."
- Quickly scroll through folder structure
- Show README.md

[0:30-1:00] Demo the Application
"Let me show you the live application."
- Open deployed URL
- Select a state and district
- Click "Show Data"
- Show the charts and metrics
- Click "Auto-detect Location" button

[1:00-1:30] Explain Technical Implementation
"The app uses React for the frontend with Recharts for visualizations.
The backend is Express with MongoDB for caching."
- Open performanceController.js
- Highlight the caching logic (lines with cache check and save)
- Mention 24-hour cache duration

[1:30-1:50] Deployment & Architecture
"The system is fully containerized with Docker Compose for local development.
For production, I deployed the backend to Render and frontend to Netlify.
The caching ensures the app works even when the government API is slow."

[1:50-2:00] Closing
"The repository includes complete setup instructions and deployment guides. 
Thank you!"
```

#### 6.4 Upload and Get Link
1. After recording, Loom will process the video
2. Click "Copy link"
3. Your link will look like: `https://www.loom.com/share/abc123def456`

### Step 7: Fill Submission Form

#### Field 1: Loom Video Link
```
https://www.loom.com/share/YOUR_VIDEO_ID
```

#### Field 2: Short Description
```
2-minute demo explaining UI design choices for low-literacy users, 
caching and API reliability strategy, and deployment architecture. 
Shows live application with auto-location detection and visual analytics.
```

#### Field 3: Hosted Project URL
```
https://mgnrega-tracker.netlify.app
```

#### Field 4: GitHub Repository URL
```
https://github.com/YOUR_USERNAME/mgnrega-performance-tracker
```

#### Field 5: Additional Notes (Optional)
```
Technical Stack:
- Frontend: React + Vite + Tailwind CSS + Recharts
- Backend: Node.js + Express + MongoDB
- Deployment: Netlify (frontend) + Render (backend) + MongoDB Atlas
- Features: 24-hour caching, auto-location detection, mobile-first design

Key Implementation Details:
- Smart caching reduces API calls and ensures reliability
- Fallback to cached data when API is unavailable
- OpenStreetMap Nominatim for reverse geocoding (no API key needed)
- Responsive design optimized for low-bandwidth users
- Docker Compose for one-click local setup
```

### Step 8: Final Checklist

Before submitting, verify:

- [ ] ✅ Backend is deployed and accessible
- [ ] ✅ Frontend is deployed and accessible
- [ ] ✅ Can select district and load data on deployed site
- [ ] ✅ Charts display correctly
- [ ] ✅ Auto-location works (on HTTPS)
- [ ] ✅ Loom video is under 2 minutes
- [ ] ✅ Loom video shows code and live demo
- [ ] ✅ GitHub repo is public
- [ ] ✅ README.md has deployment URLs
- [ ] ✅ All form fields are filled

### Common Issues & Solutions

#### Issue: API returns "Invalid API key"
**Solution**: Double-check your API key from data.gov.in profile

#### Issue: No data for selected district
**Solution**: Try different districts or check if resource ID is correct

#### Issue: Frontend can't connect to backend
**Solution**: Check CORS is enabled and VITE_API_URL is correct

#### Issue: MongoDB connection failed
**Solution**: Check MongoDB Atlas connection string and whitelist all IPs (0.0.0.0/0)

#### Issue: Docker containers crash
**Solution**: Check logs with `docker-compose logs` and ensure ports are free

#### Issue: Loom video too long
**Solution**: Focus on key points, skip unnecessary details, practice once before recording

### Need Help?

If you encounter issues:
1. Check the main README.md troubleshooting section
2. Review Docker logs: `docker-compose logs`
3. Test API directly with curl
4. Check browser console for frontend errors
5. Verify all environment variables are set correctly

---

**Good luck with your submission! 🚀**

