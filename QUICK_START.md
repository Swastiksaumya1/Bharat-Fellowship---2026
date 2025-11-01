# ⚡ Quick Start Guide

Get up and running in 5 minutes!

## Prerequisites

- Docker Desktop installed
- data.gov.in API key (get from https://data.gov.in)

## Steps

### 1. Get API Credentials (2 minutes)

1. **Register**: https://data.gov.in/users/sign_up
2. **Get API Key**: Profile → API Keys → Copy
3. **Get Resource ID**: Search "MGNREGA" → Click dataset → Copy Resource ID from API section

### 2. Setup Environment (1 minute)

```bash
# Copy environment template
cp .env.example .env

# Edit .env and paste your credentials
# Required:
# - DATA_GOV_API_KEY=your_key_here
# - DATA_GOV_RESOURCE_ID=your_resource_id_here
```

### 3. Run Application (2 minutes)

```bash
# Start everything with Docker
docker-compose up --build

# Wait for services to start...
# Look for: "✅ MongoDB connected successfully"
#           "🚀 Server listening on port 5000"
```

### 4. Open Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/health

### 5. Test It

1. Select state: "Uttar Pradesh"
2. Select district: "Varanasi"
3. Click "Show Data"
4. See charts and metrics! 📊

## Troubleshooting

### "Invalid API key"
→ Check your API key in `.env` is correct

### "No data found"
→ Try a different district or verify Resource ID

### "Port already in use"
→ Stop other services using ports 5000, 5173, or 27017

### Containers won't start
→ Run `docker-compose down` then try again

## Next Steps

- Read [README.md](README.md) for full documentation
- Read [SUBMISSION_GUIDE.md](SUBMISSION_GUIDE.md) for deployment instructions
- Customize the district list in `client/src/components/DistrictSelector.jsx`
- Deploy to production (see SUBMISSION_GUIDE.md)

## Manual Setup (Without Docker)

If you prefer not to use Docker:

### Backend
```bash
cd server
npm install
npm run dev
```

### Frontend
```bash
cd client
npm install
npm run dev
```

### MongoDB
Install MongoDB locally or use MongoDB Atlas.
Update `MONGO_URI` in `.env`.

---

**That's it! You're ready to go! 🚀**

