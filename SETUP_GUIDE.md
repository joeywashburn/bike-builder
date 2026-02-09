# Bike Builder - Quick Setup Guide

## What We've Built

A simplified, modern Shopify app that lets customers build custom bikes by selecting parts. Uses **product tags** for easy configuration (no manual product mapping needed!).

### ✅ Completed Features

1. **GDPR Compliance (MANDATORY)** - All 3 required webhooks implemented
2. **Admin Settings Page** - Simple tag-based configuration at `/app/settings`
3. **Bike Builder Component** - Customer-facing builder with modern UI
4. **API Route** - Fetches products by tags automatically
5. **Theme Customization** - Colors, header text, tagline
6. **Latest Tech Stack** - React Router v7, Polaris web components, API 2026-04

### 🚧 TODO (Next Steps)

1. **Database Schema** - Add Prisma model for settings storage
2. **Theme App Extension** - Create storefront block (run `shopify app generate extension`)
3. **Storefront Cart Integration** - Connect to Shopify cart API
4. **Save/Load Settings** - Persist merchant configuration
5. **Test in Development Store** - Run `shopify app dev`

## How It Works (Simplified!)

### For Merchants:
1. Install app
2. Tag products with `bike-builder-frame`, `bike-builder-forks`, `bike-builder-handlebars`, etc.
3. (Optional) Customize colors/text in Settings
4. Add app block to theme
5. Done!

### For Customers:
1. Visit bike builder page
2. Select parts (auto-populated from tagged products)
3. See running total
4. Add complete bike to cart
5. Checkout normally

## Quick Start

### 1. Install Dependencies
```bash
cd bike-builder
npm install
```

### 2. Configure Environment
Already configured with your client_id in `shopify.app.toml`

### 3. Start Development
```bash
shopify app dev
```

This will:
- Start the dev server
- Create a tunnel
- Install in your development store

### 4. Tag Some Products
In your development store, tag products with (singular):
- `bike-builder-frame` - for frames
- `bike-builder-fork` - for forks
- `bike-builder-handlebar` - for handlebars
- `bike-builder-grip` - for grips
- `bike-builder-pedal` - for pedals
- `bike-builder-wheel` - for wheels
- `bike-builder-seat` - for seats

**Note:** Tags are singular, app pluralizes them automatically. Default prefix is `bike-builder-` but merchants can customize it in Settings if needed.

### 5. Test the Admin
1. Open the app in your store admin
2. Go to Settings
3. Customize theme colors and text
4. Save (will implement persistence next)

## File Structure

```
bike-builder/
├── app/
│   ├── routes/
│   │   ├── app._index.jsx              # Admin dashboard
│   │   ├── app.settings.jsx            # Settings page (tag config, theme)
│   │   ├── api.parts.jsx               # API: Fetch products by tags
│   │   ├── webhooks.customers.redact.jsx    # GDPR
│   │   ├── webhooks.shop.redact.jsx         # GDPR
│   │   └── webhooks.customers.data_request.jsx  # GDPR
│   ├── components/
│   │   └── BikeBuilder.jsx             # Main bike builder component
│   ├── styles/
│   │   └── bike-builder.css            # Bike builder styles
│   └── shopify.server.js               # Shopify API setup
├── shopify.app.toml                     # App configuration
└── package.json                         # Dependencies
```

## Configuration in shopify.app.toml

The app is configured with:
- **Client ID**: Already set
- **API Version**: 2026-04 (latest)
- **Scopes**: write_products (for reading product tags)
- **Webhooks**: GDPR compliance webhooks registered

## Next Implementation Steps

### 1. Add Prisma Schema for Settings
```prisma
model Settings {
  id                String   @id @default(cuid())
  shop              String   @unique
  configurationType String   @default("tags") // "tags" or "collections"
  tagPrefix         String   @default("bike-")
  primaryColor      String   @default("#4F46E5")
  headerText        String   @default("🚲 Build Your Dream Bike")
  tagline           String   @default("Select your parts and create the perfect ride")
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}
```

### 2. Create Theme App Extension
```bash
shopify app generate extension
# Choose "Theme App Extension"
# Name: "bike-builder-block"
```

### 3. Implement Storefront Cart Integration
Use Shopify Storefront API to add variant IDs to cart

### 4. Test GDPR Webhooks
```bash
shopify app webhook trigger --topic customers/redact
shopify app webhook trigger --topic shop/redact
shopify app webhook trigger --topic customers/data_request
```

## Documentation Templates

See `/Users/joeywashburn/Projects/bike-builder/IMPLEMENTATION_PLAN.md` for:
- Privacy Policy template
- Terms of Service template
- Installation Guide template
- FAQ template
- Full roadmap

## Key Simplifications from Original Plan

1. ✅ **Tags instead of manual mapping** - Much simpler!
2. ✅ **Session-based builds** - No saved builds complexity for MVP
3. ✅ **Polaris web components** - Latest Shopify standard
4. ✅ **Simple theme customization** - Just colors and text for MVP

## MCP Servers Available

The CLI generated MCP server configs for:
- Cursor (`.cursor/mcp.json`)
- Gemini (`.gemini/extensions/shopify-dev-mcp/`)

These can help with development if needed!

---

**Status**: Core foundation complete, ready for next implementation phase
**Last Updated**: 2026-02-08
