# Render Deployment Guide

This guide will help you deploy My Teddy Magic to Render.

## Prerequisites

1. A Render account (sign up at https://render.com)
2. Your Supabase credentials:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`

## Deployment Options

### Option 1: Static Site (Recommended)

Render's Static Site service is perfect for Vite React apps and includes CDN distribution.

#### Steps:

1. **Go to Render Dashboard**
   - Navigate to https://dashboard.render.com
   - Click "New +" → "Static Site"

2. **Connect Repository**
   - Connect your GitHub repository: `https://github.com/msalmanmunirmalik/Teddy.git`
   - Or connect via Git URL

3. **Configure Build Settings**
   - **Name**: `my-teddy-magic` (or your preferred name)
   - **Branch**: `main` (or your default branch)
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Environment**: `Node`

4. **Add Environment Variables**
   Click "Advanced" → "Environment Variables" and add:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```

5. **Deploy**
   - Click "Create Static Site"
   - Render will build and deploy your app
   - Your site will be available at `https://my-teddy-magic.onrender.com`

### Option 2: Web Service

If you prefer a Web Service deployment (useful for custom server logic):

#### Steps:

1. **Go to Render Dashboard**
   - Navigate to https://dashboard.render.com
   - Click "New +" → "Web Service"

2. **Connect Repository**
   - Connect your GitHub repository

3. **Configure Service**
   - **Name**: `my-teddy-magic`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Choose your plan (Free tier available)

4. **Add Environment Variables**
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   PORT=10000
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Render will build and deploy your app

## Using render.yaml (Alternative)

If you prefer infrastructure-as-code, you can use the included `render.yaml`:

1. **Install Render CLI** (optional):
   ```bash
   npm install -g render-cli
   ```

2. **Deploy via CLI**:
   ```bash
   render deploy
   ```

Or manually create the service in Render Dashboard and it will use the `render.yaml` configuration.

## Environment Variables

Make sure to set these in your Render dashboard:

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Yes |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Your Supabase anon/public key | Yes |

## Post-Deployment

After deployment:

1. **Update Supabase Settings**
   - Go to your Supabase project dashboard
   - Navigate to Authentication → URL Configuration
   - Add your Render URL to "Site URL" and "Redirect URLs"

2. **Test Your Deployment**
   - Visit your Render URL
   - Test authentication flow
   - Verify API connections

3. **Set Up Custom Domain** (Optional)
   - In Render dashboard, go to your service
   - Click "Custom Domains"
   - Add your domain and configure DNS

## Troubleshooting

### Build Fails

- Check build logs in Render dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility (Render uses Node 18+)

### 404 Errors on Routes

- Ensure `_redirects` file exists in `public/` directory
- For Web Service, verify `server.js` is handling SPA routing correctly

### Environment Variables Not Working

- Ensure variables start with `VITE_` prefix for Vite apps
- Rebuild after adding environment variables
- Check variable names match exactly

### API Connection Issues

- Verify Supabase URL and keys are correct
- Check Supabase CORS settings
- Ensure Supabase project is active

## Monitoring

Render provides:
- **Logs**: View real-time logs in the dashboard
- **Metrics**: Monitor CPU, memory, and network usage
- **Alerts**: Set up alerts for service issues

## Cost

- **Static Site**: Free tier available (with limitations)
- **Web Service**: Free tier available (spins down after inactivity)

For production, consider upgrading to a paid plan for:
- Always-on service
- Better performance
- More resources

## Support

- Render Docs: https://render.com/docs
- Render Support: https://render.com/support
- Project Issues: Check GitHub issues

