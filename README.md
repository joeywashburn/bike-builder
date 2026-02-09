# 🚲 Bike Builder - Shopify App

A professional Shopify app that lets customers build custom bikes by selecting individual components. Perfect for bike shops offering custom builds with professional assembly services.

## Features

### For Customers
- 🎯 **Interactive Bike Builder** - Select parts from organized accordion sections
- 🔄 **Variant Selection** - Choose sizes, colors, and options for each component
- 💰 **Live Price Calculator** - See total price update in real-time
- 🛒 **One-Click Checkout** - Add entire build to cart instantly
- 📱 **Mobile Optimized** - Works beautifully on all devices

### For Merchants
- ⚙️ **Easy Setup** - Tag-based product organization (no complex mapping)
- 🎨 **Brand Customization** - Match your store's colors, fonts, and style
- 💵 **Build Fee Management** - Charge assembly fees with conditional pricing
- 📊 **Category Control** - Enable/disable specific bike part categories
- 🚀 **Theme Extension** - Seamlessly integrates with any Shopify theme

### Technical Features
- ✅ GDPR compliant with mandatory webhooks
- ✅ GraphQL Admin API integration
- ✅ App proxy for storefront access
- ✅ Accordion UI for managing 100+ products
- ✅ Real Shopify cart integration
- ✅ Professional Polaris admin interface

---

## Tech Stack

- **Framework**: React Router v7
- **Admin UI**: Polaris Web Components
- **Database**: Prisma (SQLite dev, PostgreSQL production)
- **Deployment**: Railway (recommended)
- **Shopify APIs**: Admin API 2026-04, Ajax Cart API
- **Authentication**: Shopify OAuth

---

## Quick Start

### Prerequisites

- [Shopify Partners Account](https://partners.shopify.com/)
- [Shopify CLI installed](https://shopify.dev/docs/apps/tools/cli)
- Node.js 18+ and npm
- Development store for testing

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd bike-builder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up database**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

4. **Start development server**
   ```bash
   shopify app dev
   ```

5. **Install in your development store**
   - Press 'P' to open preview URL
   - Click install and authorize the app

---

## Configuration

### Merchant Setup

1. **Tag your products** with bike builder categories:
   - `bike-builder-frame` for frames
   - `bike-builder-fork` for forks
   - `bike-builder-handlebar` for handlebars
   - etc. (14 categories available)

2. **Configure in app admin:**
   - Settings → Enable/disable categories
   - Theme Customization → Set colors, fonts, branding
   - Build Fee → Configure assembly pricing

3. **Add to your theme:**
   - Online Store → Themes → Customize
   - Add "Bike Builder" app block to a dedicated page
   - **Recommended:** Create `/pages/build-your-bike`

### Build Fee Configuration

Charge customers for professional bike assembly:

1. Create a "Build Fee" product in Shopify (e.g., $50)
2. Enable build fee in app settings
3. Set threshold for free assembly (optional)
   - Example: Free assembly on orders $500+

---

## Project Structure

```
bike-builder/
├── app/
│   ├── routes/
│   │   ├── app.settings.jsx           # Merchant settings UI
│   │   ├── api.parts.jsx              # Product fetching API
│   │   ├── apps.bike-builder.api.*.jsx # App proxy routes
│   │   └── webhooks.*.jsx             # GDPR webhooks
│   ├── services/
│   │   └── settings.server.js         # Settings management
│   └── shopify.server.js              # Shopify auth config
├── extensions/
│   └── bike-builder-block/
│       ├── blocks/bike-builder.liquid # Theme extension
│       ├── assets/bike-builder.js     # Storefront JavaScript
│       └── assets/bike-builder.css    # Storefront styles
├── prisma/
│   ├── schema.prisma                  # Database schema
│   └── migrations/                    # Database migrations
├── docs/
│   ├── DEPLOYMENT.md                  # Deployment guide
│   ├── APP_STORE_SUBMISSION.md        # App Store guide
│   ├── FAQ.md                         # Merchant FAQ
│   ├── PRIVACY_POLICY.md              # Privacy policy template
│   └── TERMS_OF_SERVICE.md            # Terms template
└── shopify.app.toml                   # App configuration
```

---

## Development

### Local Development

```bash
# Start dev server
shopify app dev

# Run database migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# View database
npx prisma studio
```

### Testing

Test the bike builder:
1. Tag products in your store
2. Add bike builder block to a page
3. Visit the page on your storefront
4. Select parts and test cart functionality

### GDPR Webhooks

Test webhooks locally:
```bash
shopify app webhook trigger --topic customers/redact
shopify app webhook trigger --topic shop/redact
shopify app webhook trigger --topic customers/data_request
```

---

## Deployment

### Railway (Recommended)

Full deployment guide in `docs/DEPLOYMENT.md`

**Quick steps:**
1. Push code to GitHub (private repo OK)
2. Create Railway account
3. Connect GitHub repository
4. Set environment variables:
   - `SHOPIFY_API_KEY`
   - `SHOPIFY_API_SECRET`
   - `NODE_ENV=production`
5. Railway auto-deploys!

**Cost:** ~$5-10/month for moderate traffic

### Environment Variables

Required for production:
```bash
SHOPIFY_API_KEY=your_api_key
SHOPIFY_API_SECRET=your_api_secret
SHOPIFY_SCOPES=read_products
DATABASE_URL=postgresql://... # Railway provides
NODE_ENV=production
HOST=your-railway-url.up.railway.app
```

---

## App Store Submission

Complete guide in `docs/APP_STORE_SUBMISSION.md`

**Checklist:**
- [ ] GDPR webhooks working
- [ ] Privacy policy hosted publicly
- [ ] Terms of service hosted publicly
- [ ] Demo video created (60-90 seconds)
- [ ] Screenshots prepared (5-8 images)
- [ ] Test store configured
- [ ] Production deployment stable
- [ ] Partners Dashboard listing complete

**Timeline:** 5-10 business days for review

---

## Features Roadmap

### Current (v1.0)
- ✅ Tag-based product categorization
- ✅ Accordion interface for 14 bike categories
- ✅ Variant dropdown selectors
- ✅ Build fee with conditional pricing
- ✅ Real cart integration
- ✅ Admin customization (colors, fonts, text)
- ✅ GDPR compliance

### Planned (v1.1+)
- ⏳ Wizard mode (step-by-step guided flow)
- ⏳ Save builds for later
- ⏳ Share builds via URL
- ⏳ Part compatibility checking
- ⏳ Build recommendations
- ⏳ Customer build gallery

---

## Documentation

- **[Deployment Guide](docs/DEPLOYMENT.md)** - Railway deployment instructions
- **[App Store Submission](docs/APP_STORE_SUBMISSION.md)** - LLC setup, pricing, submission process
- **[FAQ](docs/FAQ.md)** - Merchant frequently asked questions
- **[Privacy Policy](docs/PRIVACY_POLICY.md)** - Template for your privacy policy
- **[Terms of Service](docs/TERMS_OF_SERVICE.md)** - Template for your terms

---

## Support

- **Email:** [YOUR SUPPORT EMAIL]
- **Issues:** [GitHub Issues](https://github.com/YOUR_USERNAME/bike-builder/issues)
- **Shopify Partners:** [partners.shopify.com](https://partners.shopify.com)

---

## License

[Your License - e.g., MIT, Proprietary, etc.]

---

## Credits

Built with:
- [Shopify](https://shopify.dev) - E-commerce platform
- [React Router](https://reactrouter.com) - Full-stack framework
- [Polaris](https://polaris.shopify.com) - Shopify's design system
- [Prisma](https://prisma.io) - Database ORM
- [Railway](https://railway.app) - Deployment platform

---

**Built with ❤️ for bike shops everywhere** 🚴‍♂️
