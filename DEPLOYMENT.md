# Deployment Guide for TravelPartner on Render

This guide explains how to deploy all three components of the TravelPartner application on Render.

## Architecture Overview

The application consists of three main services:
1. **User Panel** - Next.js frontend for users (✅ Already deployed)
2. **Admin Panel** - Next.js frontend for administrators
3. **API** - Express.js backend service

## Deployment Configuration

All services are configured in the `render.yaml` file at the root of the repository. Render will automatically detect and deploy all services when you push to the repository.

## Service Configurations

### 1. User Panel (Already Deployed ✅)
- **Type**: Web Service
- **Name**: travelpartner-user-panel
- **Runtime**: Node.js
- **Root Directory**: `user-panel-main`
- **Build Command**: `yarn install && yarn build`
- **Start Command**: `yarn start`

**Required Environment Variables:**
- `NODE_ENV` = production (auto-set in render.yaml)
- `NEXT_PUBLIC_API_URL` - The URL of your deployed API (e.g., https://travelpartner-api.onrender.com)
- `NEXT_PUBLIC_LOCAL_IMAGE_HOST` - (Optional) Local image host
- `NEXT_PUBLIC_API_IMAGE_HOST` - API image host domain

### 2. Admin Panel
- **Type**: Web Service
- **Name**: travelpartner-admin-panel
- **Runtime**: Node.js
- **Root Directory**: `admin-panel-main`
- **Build Command**: `yarn install && yarn build`
- **Start Command**: `yarn start`

**Required Environment Variables:**
- `NODE_ENV` = production (auto-set in render.yaml)
- `NEXT_PUBLIC_API_BASE_URL` - The URL of your deployed API (e.g., https://travelpartner-api.onrender.com)
- `NEXT_PUBLIC_CRYPTOSECRETKEY` - Encryption secret key (e.g., "1234567812345678")
- `NEXT_PUBLIC_LOCAL_IMAGE_HOST` - (Optional) Local image host
- `NEXT_PUBLIC_API_IMAGE_HOST` - API image host domain

### 3. API (Express.js Backend)
- **Type**: Web Service
- **Name**: travelpartner-api
- **Runtime**: Node.js
- **Root Directory**: `api-main`
- **Build Command**: `npm install`
- **Start Command**: `cross-env NODE_ENV=production node babel_hook.js`

**Required Environment Variables:**
- `NODE_ENV` = production (auto-set in render.yaml)
- `PORT` - (Auto-set by Render, typically 10000)
- `DATABASE_URI` - MongoDB connection string (e.g., mongodb+srv://user:pass@cluster.mongodb.net/dbname)
- `REDIS_URL` - Redis connection string (e.g., redis://red-xxxxx:6379)
- `BASE_URL` - The URL of your deployed API (e.g., https://travelpartner-api.onrender.com)
- `ADMIN_URL` - The URL of your deployed Admin Panel (e.g., https://travelpartner-admin-panel.onrender.com)
- `RECAPTCHA_SECRET_KEY` - Google reCAPTCHA secret key (optional, leave empty if not using)

## Step-by-Step Deployment Instructions

### Prerequisites
1. A Render account (https://render.com)
2. This repository connected to your Render account
3. MongoDB database (MongoDB Atlas recommended)
4. Redis instance (Redis Cloud or Render Redis recommended)

### Deployment Steps

#### 1. Connect Repository to Render
1. Log in to your Render dashboard
2. Click "New +" and select "Blueprint"
3. Connect your GitHub repository (premium65/travelpartner-golb)
4. Render will automatically detect the `render.yaml` file

#### 2. Configure Environment Variables

**For Admin Panel:**
1. Go to the `travelpartner-admin-panel` service in Render
2. Navigate to "Environment" section
3. Add the following environment variables:
   ```
   NEXT_PUBLIC_API_BASE_URL=<your-api-url>
   NEXT_PUBLIC_CRYPTOSECRETKEY=1234567812345678
   NEXT_PUBLIC_API_IMAGE_HOST=<your-api-domain>
   ```

**For API:**
1. Go to the `travelpartner-api` service in Render
2. Navigate to "Environment" section
3. Add the following environment variables:
   ```
   DATABASE_URI=<your-mongodb-connection-string>
   REDIS_URL=<your-redis-connection-string>
   BASE_URL=<your-api-url>
   ADMIN_URL=<your-admin-panel-url>
   RECAPTCHA_SECRET_KEY=<your-recaptcha-key-or-leave-empty>
   ```

#### 3. Update User Panel Configuration
Since the API URL has changed, update the User Panel environment variables:
1. Go to the `travelpartner-user-panel` service in Render
2. Update `NEXT_PUBLIC_API_URL` to point to your deployed API

#### 4. Deploy Services
1. Render will automatically deploy all three services
2. Monitor the deployment logs for each service
3. Once deployed, test each service:
   - User Panel: Check if it can connect to the API
   - Admin Panel: Try logging in with admin credentials
   - API: Check the health endpoint (if available)

## Important Notes

### Build Times
- Each service may take 5-10 minutes to build and deploy
- The API service needs to install npm packages and will download dependencies
- The Admin and User panels need to run Next.js build process

### Database Setup
Before deploying the API, ensure:
1. MongoDB database is created and accessible
2. Database URI includes authentication credentials
3. Network access is configured (allow access from anywhere: 0.0.0.0/0)

### Redis Setup
Redis is used for caching and session management:
1. Create a Redis instance on Render or Redis Cloud
2. Copy the connection URL (format: redis://hostname:port)
3. Add to API environment variables

### CORS Configuration
The API has CORS configured to allow requests from specific origins. After deployment:
1. Update the CORS configuration in `api-main/config/index.js` if needed
2. Add your deployed frontend URLs to the CORS_ORIGIN array

### Environment Variables Priority
- Environment variables set in Render dashboard override values in `render.yaml`
- Use Render dashboard for sensitive values (API keys, database credentials)
- Use `render.yaml` for non-sensitive default values

## Troubleshooting

### Service Won't Start
- Check the deployment logs in Render dashboard
- Verify all required environment variables are set
- Ensure database and Redis are accessible

### Build Failures
- Check if package.json has all required dependencies
- Verify Node.js version compatibility (>=18.12.1)
- Clear build cache and redeploy

### Connection Issues
- Verify URLs are using HTTPS (Render provides SSL by default)
- Check CORS configuration in API
- Ensure environment variables are properly set in both frontend services

### Database Connection Errors
- Verify MongoDB connection string format
- Check network access settings in MongoDB Atlas
- Ensure database user has proper permissions

## Post-Deployment

After successful deployment:
1. Test all three services independently
2. Verify frontend-to-backend communication
3. Check admin login functionality
4. Monitor logs for any errors
5. Set up custom domains (optional)

## Monitoring

Render provides:
- Automatic health checks
- Service metrics
- Log streaming
- Automatic SSL certificates

Access these from your Render dashboard for each service.

## Support

For issues specific to:
- Render platform: Check Render documentation (https://render.com/docs)
- Application issues: Check application logs in Render dashboard
- Configuration issues: Review this deployment guide

## Updates and Redeployment

To redeploy after code changes:
1. Push changes to your GitHub repository
2. Render will automatically detect changes
3. Services will redeploy automatically (if auto-deploy is enabled)
4. Monitor deployment progress in Render dashboard
