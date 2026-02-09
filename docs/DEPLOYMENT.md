# Bike Builder - Production Deployment Guide

This guide covers deploying the Bike Builder app to production using Railway (recommended) or alternative hosting platforms.

---

## Prerequisites

Before deploying to production, ensure you have:

- ✅ Completed local development and testing
- ✅ Shopify Partners account with app created
- ✅ GDPR webhooks configured in Partners Dashboard
- ✅ Privacy Policy and Terms of Service URLs ready
- ✅ GitHub repository with your code
- ✅ Railway account (or alternative hosting account)

---

## Railway Deployment (Recommended)

Railway is recommended for Shopify apps due to:
- Simple deployment from GitHub
- Automatic SSL certificates
- Easy environment variable management
- Affordable pricing (~$5-10/month for moderate traffic)
- Great for React Router v7 apps

### Step 1: Prepare Your Repository

1. **Commit all changes:**
   ```bash
   git add .
   git commit -m "Prepare for production deployment"
   ```

2. **Push to GitHub:**
   ```bash
   git push origin main
   ```

3. **Ensure `.gitignore` excludes:**
   - `.env`
   - `node_modules/`
   - `.shopify/`
   - `dev.sqlite`
   - `prisma/dev.db`

### Step 2: Set Up Railway Project

1. **Create Railway account:** https://railway.app
2. **Click "New Project"**
3. **Select "Deploy from GitHub repo"**
4. **Connect your GitHub account and select your bike-builder repository**
5. **Railway will auto-detect React Router and configure build settings**

### Step 3: Configure Environment Variables

In Railway project settings, add these environment variables:

```bash
# Shopify API Credentials (from Partners Dashboard)
SHOPIFY_API_KEY=your_api_key_here
SHOPIFY_API_SECRET=your_api_secret_here

# Shopify App Configuration
SHOPIFY_SCOPES=read_products
SHOPIFY_API_VERSION=2026-04

# Database (Railway provides PostgreSQL)
DATABASE_URL=postgresql://... # Railway auto-provides this

# Node Environment
NODE_ENV=production

# Host (Railway provides this automatically)
HOST=${{RAILWAY_STATIC_URL}}
```

**Important:** Get your API key and secret from:
- Shopify Partners Dashboard → Apps → [Your App] → Client credentials

### Step 4: Set Up Production Database

Railway provides PostgreSQL automatically. Update your Prisma configuration:

1. **Update `prisma/schema.prisma`:**
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. **Railway will automatically run migrations** during deployment.

3. **Or manually run migrations:**
   ```bash
   railway run npx prisma migrate deploy
   ```

### Step 5: Update shopify.app.toml

Once deployed, Railway provides a URL like: `https://bike-builder-production.up.railway.app`

Update these fields in `shopify.app.toml`:

```toml
application_url = "https://bike-builder-production.up.railway.app"

[auth]
redirect_urls = [
  "https://bike-builder-production.up.railway.app/api/auth"
]
```

**Commit and push these changes:**
```bash
git add shopify.app.toml
git commit -m "Update production URLs"
git push origin main
```

Railway will automatically redeploy.

### Step 6: Update Shopify Partners Dashboard

1. **Go to Partners Dashboard → Apps → [Your App] → App setup**

2. **Update URLs:**
   - App URL: `https://bike-builder-production.up.railway.app`
   - Allowed redirection URL(s): `https://bike-builder-production.up.railway.app/api/auth`

3. **Configure GDPR Webhooks (MANDATORY):**
   - Go to: App setup → Data protection
   - Add these endpoints:
     - Customer data request: `https://bike-builder-production.up.railway.app/webhooks/customers/data_request`
     - Customer data erasure: `https://bike-builder-production.up.railway.app/webhooks/customers/redact`
     - Shop data erasure: `https://bike-builder-production.up.railway.app/webhooks/shop/redact`

4. **Verify App proxy:**
   - Should show: `/apps/bike-builder` → `https://bike-builder-production.up.railway.app/apps/bike-builder`

### Step 7: Test Production Installation

1. **Install app in a test store:**
   - Visit: `https://bike-builder-production.up.railway.app`
   - Or: Partners Dashboard → Test your app → Select development store

2. **Verify OAuth flow completes successfully**

3. **Test bike builder functionality:**
   - Add bike builder block to a page
   - Verify products load
   - Test variant selection
   - Test accordion sections
   - Check responsive design on mobile

4. **Test GDPR webhooks:**
   ```bash
   # Use Shopify CLI to trigger test webhooks
   shopify app webhook trigger --topic customers/redact --delivery-method http --address https://bike-builder-production.up.railway.app/webhooks/customers/redact
   ```

### Step 8: Monitor Deployment

Railway provides:
- **Logs:** Real-time application logs
- **Metrics:** CPU, memory, network usage
- **Deployments:** History of all deployments

**Monitor for:**
- 500 errors (server errors)
- 404 errors (missing routes)
- Slow API responses (>2 seconds)
- High memory usage (>512MB)

---

## Alternative Hosting: Fly.io

Fly.io is another great option for Shopify apps:

1. **Install Fly CLI:**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Initialize Fly app:**
   ```bash
   fly launch
   ```

3. **Set secrets:**
   ```bash
   fly secrets set SHOPIFY_API_KEY=your_key
   fly secrets set SHOPIFY_API_SECRET=your_secret
   fly secrets set NODE_ENV=production
   ```

4. **Deploy:**
   ```bash
   fly deploy
   ```

5. **Follow Steps 5-8 above** to configure Shopify Partners Dashboard

---

## Database Migration (SQLite → PostgreSQL)

If you developed locally with SQLite, migrate to PostgreSQL for production:

### Option 1: Fresh Migration (Recommended)

Let Railway create a fresh database with your schema:

1. **Update `prisma/schema.prisma`:**
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. **Create new migration:**
   ```bash
   npx prisma migrate dev --name init_postgresql
   ```

3. **Commit and deploy:**
   ```bash
   git add prisma/
   git commit -m "Switch to PostgreSQL"
   git push origin main
   ```

### Option 2: Migrate Data (If you have important settings)

If you have merchant settings in SQLite you want to preserve:

1. **Export data from SQLite:**
   ```bash
   npx prisma db seed # If you have a seed script
   # Or manually export with SQL queries
   ```

2. **Import to PostgreSQL after deployment**

3. **For merchant settings:** Merchants will need to reconfigure their settings after production deployment (one-time only)

---

## Production Checklist

Before submitting to Shopify App Store:

### Technical Requirements
- [ ] App deploys successfully to Railway/Fly.io
- [ ] OAuth authentication works in production
- [ ] GDPR webhooks respond with 200 OK
- [ ] App proxy works (bike builder loads on storefront)
- [ ] Products load correctly via API
- [ ] Variant selection works
- [ ] No console errors in browser
- [ ] Mobile responsive design works
- [ ] SSL certificate is valid (Railway provides automatically)

### Shopify Partners Dashboard
- [ ] Application URL points to production deployment
- [ ] Redirect URLs updated to production
- [ ] GDPR webhooks configured and tested
- [ ] Access scopes verified (read_products)
- [ ] App proxy configuration saved

### Documentation
- [ ] Privacy Policy URL accessible
- [ ] Terms of Service URL accessible
- [ ] Support email configured and monitored
- [ ] FAQ documentation complete
- [ ] Installation guide finalized

### Performance
- [ ] API responses < 500ms average
- [ ] Lighthouse score > 70 (Performance)
- [ ] No memory leaks (monitor in Railway)
- [ ] Database queries optimized
- [ ] Proper caching headers (5-min cache on /api/parts)

### Security
- [ ] Environment variables stored securely (not in code)
- [ ] No API keys committed to Git
- [ ] HTTPS enforced (Railway handles automatically)
- [ ] OAuth tokens stored securely in database
- [ ] GDPR compliance verified

---

## Troubleshooting Production Issues

### "App failed to load" in production
**Cause:** OAuth redirect URLs don't match
**Fix:** Verify `shopify.app.toml` and Partners Dashboard URLs match exactly

### GDPR webhooks returning errors
**Cause:** Routes not deployed or incorrect URLs
**Fix:** Verify routes exist in `app/routes/webhooks.*` and URLs in Partners Dashboard are correct

### Products not loading on storefront
**Cause:** App proxy configuration mismatch
**Fix:**
1. Check `shopify.app.toml` app proxy settings
2. Verify route exists at `app/routes/apps.bike-builder.api.parts.jsx`
3. Merchants may need to reinstall app (app proxy changes only apply to new installs)

### Database connection errors
**Cause:** DATABASE_URL not set or incorrect
**Fix:**
1. Verify Railway PostgreSQL addon is attached
2. Check environment variable `DATABASE_URL` is set
3. Run `railway run npx prisma migrate deploy`

### 500 Server Errors
**Cause:** Various - check logs
**Fix:**
1. Check Railway logs: `railway logs`
2. Look for stack traces
3. Common issues: missing env vars, database connection, API errors

---

## Monitoring & Maintenance

### Railway Monitoring

**View logs:**
```bash
railway logs
```

**View metrics:**
- Go to Railway dashboard → [Your project] → Metrics
- Monitor: CPU, Memory, Network

**Set up alerts:**
- Railway → Settings → Notifications
- Configure alerts for downtime, high CPU, errors

### Health Checks

Create a health check endpoint:

**File:** `app/routes/health.jsx`
```javascript
export const loader = async () => {
  // Check database connection
  // Check API availability
  return Response.json({ status: 'ok', timestamp: new Date().toISOString() });
};
```

### Performance Monitoring

**Use Shopify's built-in metrics:**
- Partners Dashboard → Apps → [Your App] → Analytics
- Monitor: Installs, API calls, errors

**Optional: Add external monitoring:**
- Sentry (error tracking)
- LogRocket (session replay)
- Datadog (APM)

---

## Scaling Considerations

### When to scale:
- More than 100 active merchants
- API response times > 1 second
- Memory usage consistently > 80%
- Database query times > 200ms

### How to scale on Railway:
1. **Vertical scaling:** Increase memory/CPU in Railway settings
2. **Database optimization:** Add indexes, optimize queries
3. **Caching:** Increase cache TTL, add Redis
4. **CDN:** Use Shopify's CDN for static assets

### Cost estimates:
- **Starter (< 50 merchants):** ~$5/month
- **Growth (50-500 merchants):** ~$20/month
- **Scale (500+ merchants):** ~$50-100/month

---

## Rollback Procedure

If production deployment has issues:

### Option 1: Revert in Railway
1. Go to Railway → Deployments
2. Click on previous working deployment
3. Click "Redeploy"

### Option 2: Git Revert
```bash
git revert HEAD
git push origin main
# Railway auto-deploys
```

### Option 3: Emergency Shutdown
```bash
railway down # Stops the service
# Fix issues, then redeploy
railway up
```

---

## Post-Deployment Steps

1. **Announce to beta testers** (if applicable)
2. **Monitor logs for first 24 hours**
3. **Gather merchant feedback**
4. **Fix any critical bugs immediately**
5. **Schedule regular maintenance windows**
6. **Plan next feature release**

---

## Support & Resources

- **Railway Docs:** https://docs.railway.app
- **Shopify App Deployment:** https://shopify.dev/docs/apps/deployment
- **React Router Deployment:** https://reactrouter.com/start/framework/deployment
- **Prisma with PostgreSQL:** https://www.prisma.io/docs/concepts/database-connectors/postgresql

**Need help?** Contact your development team or Shopify Partner support.

---

**Next Steps:** Once production deployment is stable, proceed with App Store submission (Phase 8).
