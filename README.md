# TravelPartner Golb

This repository contains the complete source code for the TravelPartner platform.

## Projects
- **admin-panel-main** – Admin dashboard (Next.js)
- **api-main** – Backend API service (Express.js)
- **user-panel-main** – User-facing web application (Next.js)

## Tech Stack
- Frontend: React / Next.js
- Backend: Node.js / Express.js
- Database: MongoDB
- Cache: Redis

## Deployment on Render 🚀

All three services are configured for deployment on Render using the `render.yaml` blueprint.

### Quick Start
- **New to deployment?** See [QUICKSTART.md](./QUICKSTART.md)
- **Detailed guide:** See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Environment variables:** See [ENV_VARS.md](./ENV_VARS.md)

### Deployment Status
- ✅ **User Panel** - Deployed
- 🚀 **Admin Panel** - Ready to deploy (see documentation)
- 🚀 **API** - Ready to deploy (see documentation)

## Local Development Setup

Each folder is an independent project.

### Admin Panel
```bash
cd admin-panel-main
npm install
npm run dev
```

### API
```bash
cd api-main
npm install
npm run dev
```

### User Panel
```bash
cd user-panel-main
npm install  # or yarn install
npm run dev  # or yarn dev
```

## Environment Variables

Each service requires specific environment variables. See [ENV_VARS.md](./ENV_VARS.md) for complete documentation.

## Contributing

1. Create a feature branch
2. Make your changes
3. Test locally
4. Submit a pull request

## Support

For deployment issues, refer to the deployment documentation in this repository.
