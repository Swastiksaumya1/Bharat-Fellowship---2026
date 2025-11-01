# 🔒 Security Guidelines

This document outlines security best practices for the MGNREGA Performance Tracker project.

## ✅ Security Fixes Applied

### MongoDB URI Format
All example MongoDB connection strings have been updated to use placeholder format:

**❌ Old (Insecure):**
```
mongodb+srv://user:pass@cluster.mongodb.net/mgnrega
```

**✅ New (Secure):**
```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>
```

This prevents GitHub's secret scanning from flagging example credentials as real secrets.

## 🔐 Environment Variables Security

### Never Commit These Files
- ✅ `.env` is in `.gitignore`
- ✅ Only `.env.example` is committed (with placeholders)
- ✅ No real credentials in documentation

### Required Environment Variables

```env
# MongoDB Connection (NEVER commit real values)
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>

# data.gov.in API Credentials (NEVER commit real values)
DATA_GOV_API_KEY=your_actual_api_key_here
DATA_GOV_RESOURCE_ID=your_actual_resource_id_here

# Server Configuration
NODE_ENV=production
PORT=5000
```

## 🛡️ Best Practices

### 1. API Key Management
- **Never** commit API keys to Git
- **Always** use environment variables
- **Rotate** API keys if accidentally exposed
- **Use** different keys for development and production

### 2. MongoDB Security
- **Enable** MongoDB Atlas IP whitelist
- **Use** strong passwords (16+ characters, mixed case, numbers, symbols)
- **Enable** database authentication
- **Rotate** credentials regularly
- **Use** read-only users where possible

### 3. CORS Configuration
Current configuration allows all origins (`*`) for development:

```javascript
app.use(cors({
  origin: '*'
}));
```

**For Production**, restrict to your frontend domain:

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://your-app.netlify.app',
  credentials: true
}));
```

### 4. Rate Limiting
Consider adding rate limiting for production:

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### 5. Input Validation
Always validate user inputs:

```javascript
// Example: Validate district and state parameters
if (!state || !district) {
  return res.status(400).json({ error: 'State and district are required' });
}

// Sanitize inputs to prevent injection
const sanitizedState = state.trim().replace(/[^a-zA-Z\s]/g, '');
const sanitizedDistrict = district.trim().replace(/[^a-zA-Z\s]/g, '');
```

## 🚨 What to Do If Credentials Are Exposed

### If API Key is Exposed:
1. **Immediately** log in to data.gov.in
2. **Revoke** the exposed API key
3. **Generate** a new API key
4. **Update** environment variables in deployment platforms
5. **Restart** your application

### If MongoDB URI is Exposed:
1. **Immediately** change MongoDB Atlas password
2. **Update** IP whitelist to remove unauthorized IPs
3. **Generate** new connection string
4. **Update** environment variables
5. **Restart** your application
6. **Review** database logs for unauthorized access

### If GitHub Detects Secrets:
1. **Review** the alert in GitHub Security tab
2. **Rotate** the exposed credential immediately
3. **Update** the file with placeholder format
4. **Commit** the fix
5. **Push** to GitHub
6. **Verify** the alert is resolved

## 📝 Deployment Security Checklist

### Before Deploying:
- [ ] All environment variables use placeholders in code
- [ ] `.env` file is in `.gitignore`
- [ ] No hardcoded credentials in source code
- [ ] CORS is configured for production domain
- [ ] MongoDB IP whitelist is configured
- [ ] Strong passwords are used (16+ characters)
- [ ] API keys are stored in deployment platform's secrets

### After Deploying:
- [ ] Test that environment variables are loaded correctly
- [ ] Verify CORS allows only your frontend domain
- [ ] Check MongoDB connection is secure (SSL/TLS)
- [ ] Monitor for unusual API usage
- [ ] Set up alerts for failed authentication attempts

## 🔍 Security Scanning

### GitHub Secret Scanning
GitHub automatically scans for exposed secrets. If detected:
- You'll receive an email alert
- Alert appears in Security → Secret scanning alerts
- Follow remediation steps above

### Manual Security Audit
Run these commands to check for potential issues:

```bash
# Check for hardcoded credentials
grep -r "password" --include="*.js" --include="*.jsx" server/ client/

# Check for API keys in code
grep -r "api.key" --include="*.js" --include="*.jsx" server/ client/

# Check for MongoDB URIs
grep -r "mongodb://" --include="*.js" --include="*.jsx" server/ client/
```

All should return no results (or only comments/placeholders).

## 🌐 Production Deployment Security

### Render.com / Railway
- ✅ Environment variables are encrypted at rest
- ✅ Use "Secret" type for sensitive values
- ✅ Enable automatic deployments only from protected branches
- ✅ Set up deploy notifications

### Netlify / Vercel
- ✅ Environment variables are encrypted
- ✅ Use different values for preview vs production
- ✅ Enable branch protection on GitHub
- ✅ Review build logs for exposed secrets

### MongoDB Atlas
- ✅ Enable IP whitelist (add deployment platform IPs)
- ✅ Use database-specific users (not admin)
- ✅ Enable audit logging
- ✅ Set up alerts for unusual activity
- ✅ Enable encryption at rest

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [MongoDB Security Checklist](https://www.mongodb.com/docs/manual/administration/security-checklist/)
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

## 🔄 Regular Security Maintenance

### Monthly:
- [ ] Review and rotate API keys
- [ ] Check MongoDB Atlas security recommendations
- [ ] Review application logs for suspicious activity
- [ ] Update dependencies (`npm audit fix`)

### Quarterly:
- [ ] Change MongoDB passwords
- [ ] Review CORS configuration
- [ ] Audit user access and permissions
- [ ] Review and update security policies

## ⚠️ Disclaimer

This is a demonstration project for the Bharat Fellowship 2026 application. For production use:

1. Implement proper authentication and authorization
2. Add comprehensive input validation
3. Set up monitoring and alerting
4. Conduct regular security audits
5. Follow data.gov.in terms of service
6. Comply with data protection regulations (if applicable)

---

**Remember: Security is not a one-time task, it's an ongoing process! 🔒**

