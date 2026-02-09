# Quick Start - Render Deployment

This is a quick reference guide for deploying all services to Render.

## ✅ User Panel - Already Deployed

The user panel is already deployed and working!

## 🚀 Deploy API and Admin Panel

### Step 1: Prepare External Services

**MongoDB Atlas:**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Create database user with password
4. Whitelist all IPs (0.0.0.0/0)
5. Get connection string

**Redis (Option A - Render Redis):**
1. In Render Dashboard: New+ → Redis
2. Name it (e.g., travelpartner-redis)
3. Select free plan
4. Create Redis
5. Copy the "Internal Redis URL"

**Redis (Option B - Redis Cloud):**
1. Create account at https://redis.com/try-free/
2. Create free database
3. Get connection URL

### Step 2: Deploy on Render

1. **Connect Repository:**
   - Go to Render Dashboard
   - Click "New+" → "Blueprint"
   - Connect GitHub repo: premium65/travelpartner-golb
   - Render detects render.yaml automatically

2. **Set Environment Variables for API:**
   
   Navigate to `travelpartner-api` service → Environment tab:
   ```
   DATABASE_URI = mongodb+srv://user:pass@cluster.mongodb.net/travelpartner
   REDIS_URL = redis://red-xxxxx:6379
   BASE_URL = https://travelpartner-api.onrender.com
   ADMIN_URL = https://travelpartner-admin-panel.onrender.com
   RECAPTCHA_SECRET_KEY = (leave empty or add your key)
   ```

3. **Set Environment Variables for Admin Panel:**
   
   Navigate to `travelpartner-admin-panel` service → Environment tab:
   ```
   NEXT_PUBLIC_API_BASE_URL = https://travelpartner-api.onrender.com
   NEXT_PUBLIC_CRYPTOSECRETKEY = 1234567812345678
   NEXT_PUBLIC_API_IMAGE_HOST = api.goibtech.site
   ```

4. **Update User Panel Variables:**
   
   Navigate to `travelpartner-user-panel` service → Environment tab:
   ```
   NEXT_PUBLIC_API_BASE_URL = https://travelpartner-api.onrender.com
   NEXT_PUBLIC_API_IMAGE_HOST = api.goibtech.site
   NEXT_PUBLIC_ADMIN_PANEL_URL = https://travelpartner-admin-panel.onrender.com
   ```

### Step 3: Monitor Deployment

1. Check each service in Render Dashboard
2. Monitor logs for errors
3. Wait for all services to show "Live" status (5-10 minutes)

### Step 4: Test

1. **Test API:** Visit https://travelpartner-api.onrender.com
2. **Test Admin Panel:** Visit https://travelpartner-admin-panel.onrender.com
3. **Test User Panel:** Visit https://travelpartner-user-panel.onrender.com

## Important URLs

After deployment, your services will be available at:
- API: `https://travelpartner-api.onrender.com`
- Admin Panel: `https://travelpartner-admin-panel.onrender.com`
- User Panel: `https://travelpartner-user-panel.onrender.com`

*Note: Replace these with your actual Render URLs if different*

## Troubleshooting

**Build Failed?**
- Check logs in Render Dashboard
- Verify all dependencies in package.json
- Try manual redeploy

**Service won't start?**
- Verify all environment variables are set
- Check that DATABASE_URI and REDIS_URL are correct
- Look at service logs for specific errors

**Connection errors?**
- Ensure all URLs use HTTPS
- Verify CORS settings in API
- Check that services can communicate

## Need Help?

- Full documentation: See [DEPLOYMENT.md](./DEPLOYMENT.md)
- Environment variables: See [ENV_VARS.md](./ENV_VARS.md)
- Render docs: https://render.com/docs
