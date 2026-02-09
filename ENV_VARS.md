# Environment Variables Configuration

This document lists all environment variables required for each service.

## Admin Panel Environment Variables

Create these in Render Dashboard under the Admin Panel service settings:

```env
# Required - URL of the API service
NEXT_PUBLIC_API_BASE_URL=https://travelpartner-api.onrender.com

# Required - Encryption key (16 characters)
NEXT_PUBLIC_CRYPTOSECRETKEY=1234567812345678

# Optional - Local development image host
NEXT_PUBLIC_LOCAL_IMAGE_HOST=

# Required - Production API domain for images
NEXT_PUBLIC_API_IMAGE_HOST=api.goibtech.site
```

## API Environment Variables

Create these in Render Dashboard under the API service settings:

```env
# Auto-set by Render (do not set manually)
PORT=10000

# Required - MongoDB connection string
DATABASE_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority

# Required - Redis connection string
REDIS_URL=redis://hostname:port

# Required - Base URL of the API itself
BASE_URL=https://travelpartner-api.onrender.com

# Required - URL of the Admin Panel
ADMIN_URL=https://travelpartner-admin-panel.onrender.com

# Optional - Google reCAPTCHA secret key (leave empty if not using)
RECAPTCHA_SECRET_KEY=
```

## User Panel Environment Variables

Update these in Render Dashboard under the User Panel service settings:

```env
# Required - URL of the API service
NEXT_PUBLIC_API_URL=https://travelpartner-api.onrender.com

# Optional - Local development image host
NEXT_PUBLIC_LOCAL_IMAGE_HOST=

# Required - Production API domain for images
NEXT_PUBLIC_API_IMAGE_HOST=api.goibtech.site
```

## Notes

1. Replace `https://travelpartner-api.onrender.com` with your actual API URL from Render
2. Replace `https://travelpartner-admin-panel.onrender.com` with your actual Admin Panel URL from Render
3. The `PORT` variable for the API is automatically set by Render - do not set it manually
4. Keep your `DATABASE_URI` and `REDIS_URL` secure - do not commit them to the repository
5. The `CRYPTOSECRETKEY` must be exactly 16 characters for AES encryption to work properly

## Getting MongoDB and Redis URLs

### MongoDB (MongoDB Atlas)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Add a database user
4. Whitelist IP: 0.0.0.0/0 (allow from anywhere)
5. Get connection string from "Connect" -> "Connect your application"
6. Format: `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>`

### Redis (Render Redis or Redis Cloud)
1. Create a Redis instance on Render (New+ -> Redis) or use Redis Cloud
2. Get the connection URL
3. Format for Render Redis: `redis://red-xxxxx:6379`
4. Format for Redis Cloud: `redis://default:password@redis-xxxxx.cloud.redislabs.com:port`
