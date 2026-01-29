# Vercel Environment Variables Setup

## Setup Using Vercel CLI

Install Vercel CLI if you haven't:

```bash
npm i -g vercel
vercel login
vercel link  # Link to your project
```

## Add Environment Variables

Run these commands from your local machine where you have access to `.env`:

```bash
# Navigate to project directory
cd andoffer

# Database
echo "$DATABASE_URL" | vercel env add DATABASE_URL production
echo "$DATABASE_URL" | vercel env add DATABASE_URL preview
echo "$DATABASE_URL" | vercel env add DATABASE_URL development

# Mail Service
echo "$ANDOFFER_MAIL_API_KEY" | vercel env add ANDOFFER_MAIL_API_KEY production
echo "$ANDOFFER_MAIL_API_KEY" | vercel env add ANDOFFER_MAIL_API_KEY preview
echo "$ANDOFFER_DEFAULT_FROM" | vercel env add ANDOFFER_DEFAULT_FROM production
echo "$ANDOFFER_DEFAULT_FROM" | vercel env add ANDOFFER_DEFAULT_FROM preview

# Assets API
echo "$ASSETS_API_KEY" | vercel env add ASSETS_API_KEY production
echo "$ASSETS_API_KEY" | vercel env add ASSETS_API_KEY preview
echo "$ASSETS_API_SECRET" | vercel env add ASSETS_API_SECRET production
echo "$ASSETS_API_SECRET" | vercel env add ASSETS_API_SECRET preview

# Authentication (Optional - for future use)
echo "$NEXTAUTH_URL" | vercel env add NEXTAUTH_URL production
echo "$NEXTAUTH_SECRET" | vercel env add NEXTAUTH_SECRET production
echo "$ANDOFFER_JWT_SECRET" | vercel env add ANDOFFER_JWT_SECRET production

# Stripe (Optional)
echo "$STRIPE_SECRET_KEY" | vercel env add STRIPE_SECRET_KEY production
echo "$STRIPE_WEBHOOK_SECRET" | vercel env add STRIPE_WEBHOOK_SECRET production

# CORS
echo "$ANDOFFER_ALLOWED_ORIGINS" | vercel env add ANDOFFER_ALLOWED_ORIGINS production
```

## Alternative: Bulk Import Script

Create a script to add all at once:

```bash
#!/bin/bash
# add-vercel-env.sh

source .env

# Function to add env var to all environments
add_env() {
  local key=$1
  local value=$2
  echo "$value" | vercel env add "$key" production
  echo "$value" | vercel env add "$key" preview
  echo "$value" | vercel env add "$key" development
}

# Add all variables
add_env "DATABASE_URL" "$DATABASE_URL"
add_env "ANDOFFER_MAIL_API_KEY" "$ANDOFFER_MAIL_API_KEY"
add_env "ANDOFFER_DEFAULT_FROM" "$ANDOFFER_DEFAULT_FROM"
add_env "ASSETS_API_KEY" "$ASSETS_API_KEY"
add_env "ASSETS_API_SECRET" "$ASSETS_API_SECRET"

echo "✅ Environment variables added to Vercel"
```

Make executable and run:

```bash
chmod +x add-vercel-env.sh
./add-vercel-env.sh
```

## Manual Setup (Vercel Dashboard)

If you prefer the UI:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project → **Settings** → **Environment Variables**
3. Add each variable:
   - Click **Add New**
   - Enter variable name (e.g., `DATABASE_URL`)
   - Paste value from your local `.env` file
   - Select environments: Production, Preview, Development
   - Click **Save**

## Required Variables

These must be set for the app to work:

- ✅ `DATABASE_URL` - PostgreSQL connection string
- ✅ `ASSETS_API_KEY` - Assets API key
- 🔵 `ANDOFFER_MAIL_API_KEY` - Mail API (optional but recommended)
- 🔵 `ANDOFFER_DEFAULT_FROM` - Default from email
- 🔵 `ASSETS_API_SECRET` - Assets API secret (if required)

## Post-Deployment Setup

### 1. Database Schema Push

After first deployment with DATABASE_URL:

```bash
# From local with DATABASE_URL in .env
npm run db:push
```

Or add to `package.json` for automatic schema push:

```json
{
  "scripts": {
    "postinstall": "prisma generate --config prisma/prisma.config.ts",
    "vercel-build": "prisma db push --config prisma/prisma.config.ts && next build"
  }
}
```

### 2. Configure WhatsApp

1. Visit your deployed site: `https://your-domain.vercel.app/settings`
2. Add WhatsApp group invite link
3. Toggle "Show WhatsApp Button" on

### 3. Verify Deployment

- [ ] Visit homepage - loads without errors
- [ ] Visit `/settings` - settings page accessible
- [ ] Visit `/products` - dashboard works
- [ ] Check Vercel logs for database connection
- [ ] Test WhatsApp button appears on homepage

## Generate Secrets

For `NEXTAUTH_SECRET` and `ANDOFFER_JWT_SECRET`:

```bash
# Generate secure random secret
openssl rand -base64 32
```

Or use: https://generate-secret.vercel.app/32

## Troubleshooting

**Database connection fails:**

- Verify DATABASE_URL is correct
- Check if database accepts connections from Vercel IPs
- Ensure database is publicly accessible or use Vercel Postgres

**Assets API errors:**

- Verify ASSETS_API_KEY is valid
- Check ASSETS_BASE_URL is correct (default: https://www.assets.andgroupco.com)

**Build fails:**

- Run `npm run build` locally first
- Check Vercel build logs for specific errors
- Ensure all required environment variables are set

## Pull Environment Variables Locally

To sync Vercel env vars to your local machine:

```bash
vercel env pull .env.local
```

**⚠️ Never commit `.env`, `.env.local`, or any files with secrets to Git!**
