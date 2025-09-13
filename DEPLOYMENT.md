# Deployment Guide for Chinese Heritage Project

## Project Structure

This is a full-stack application with:
- **Frontend**: React + TypeScript + Vite (in `/frontend` directory)
- **Backend**: Go server (in `/backend` directory)
- **Database**: PostgreSQL (configured in backend)

## Vercel Deployment (Recommended for Frontend)

### 1. Prerequisites
- GitHub account with this repository
- Vercel account (sign up at vercel.com)

### 2. Deploy to Vercel

#### Option A: Automatic GitHub Integration (Recommended)
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "New Project" and select this repository
3. Vercel will automatically detect the configuration from `vercel.json`
4. Click "Deploy" - that's it!

#### Option B: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project root
vercel

# Follow the prompts, Vercel will use the vercel.json configuration
```

### 3. Configuration Details

The project includes:
- `vercel.json` - Main Vercel configuration
- `frontend/public/_redirects` - SPA routing support
- `frontend/public/robots.txt` - SEO optimization
- Environment configurations in `frontend/.env.*`

### 4. Custom Domain (Optional)
1. In Vercel dashboard, go to your project
2. Go to Settings > Domains
3. Add your custom domain
4. Follow DNS configuration instructions

## Backend Deployment Options

### Option 1: Separate Backend Deployment
Deploy the Go backend separately on:
- **Railway**: Easy Go deployment
- **Render**: Free tier available
- **DigitalOcean App Platform**: Scalable option
- **Google Cloud Run**: Serverless container deployment

### Option 2: Vercel Serverless Functions
Convert Go handlers to Vercel serverless functions (requires refactoring).

## Environment Variables

### Frontend Environment Variables
Set these in Vercel dashboard under Settings > Environment Variables:

```
VITE_API_BASE_URL=https://your-backend-url.com
VITE_NODE_ENV=production
VITE_ENABLE_ANALYTICS=true
```

### Backend Environment Variables
For your backend deployment platform:

```
PORT=8080
DATABASE_URL=postgres://user:password@host:port/database
DEBUG=false
RESTART=false
```

## Build Commands Reference

### Frontend Only (Current Vercel Setup)
```bash
# Install dependencies
cd frontend && npm install

# Build for production
cd frontend && npm run build

# Preview build locally
cd frontend && npm run preview
```

### Full Stack Development
```bash
# Frontend development
cd frontend && npm run dev

# Backend development (in another terminal)
cd backend && go run main.go
```

## File Structure for Deployment

```
ICH/
├── vercel.json              # Vercel configuration
├── package.json             # Root package.json with build scripts
├── DEPLOYMENT.md            # This file
├── .gitignore              # Proper gitignore for all environments
├── frontend/
│   ├── dist/               # Build output (auto-generated)
│   ├── public/
│   │   ├── _redirects      # SPA routing for Vercel
│   │   └── robots.txt      # SEO configuration
│   ├── .env.example        # Environment template
│   ├── .env.production     # Production environment
│   └── vite.config.ts      # Optimized build configuration
└── backend/                # Go backend (deploy separately)
```

## Troubleshooting

### Common Issues

1. **Build fails with TypeScript errors**
   - Run `cd frontend && npm run build` locally first
   - Fix any TypeScript errors before deploying

2. **404 errors on page refresh**
   - Ensure `_redirects` file is in `frontend/public/`
   - Check that `vercel.json` includes proper rewrite rules

3. **Assets not loading**
   - Verify build output in `frontend/dist/assets/`
   - Check that asset references are relative paths

4. **Backend API not accessible**
   - Deploy backend separately and update `VITE_API_BASE_URL`
   - Ensure CORS is configured in backend for your domain

### Testing Deployment Locally

```bash
# Test production build locally
cd frontend && npm run build && npm run preview

# Test with backend
cd backend && go run main.go
# In another terminal:
cd frontend && npm run dev
```

## Performance Optimization

The current configuration includes:
- ✅ Code splitting (vendor, router, UI chunks)
- ✅ Asset optimization
- ✅ Compression ready
- ✅ SEO meta tags
- ✅ Production environment configuration

## Security Considerations

- Environment variables are properly configured
- No sensitive data in client-side code
- HTTPS enforced on Vercel
- Proper CORS configuration needed for API

## Support

For deployment issues:
1. Check Vercel deployment logs
2. Verify all environment variables are set
3. Test build locally with `npm run build`
4. Ensure backend is accessible if using API features