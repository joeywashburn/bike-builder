# Bike Builder App - Frequently Asked Questions

## Installation & Setup

### Q: How do I install the Bike Builder app?
**A:** Visit the Shopify App Store, search for "Bike Builder", and click "Add app". Follow the OAuth authorization flow to grant the required permissions. The app will automatically install and be available in your Shopify admin under "Apps".

### Q: Where should I add the Bike Builder block?
**A:** **We strongly recommend creating a dedicated page** for the bike builder (e.g., `/pages/build-your-bike`). Here's why:
- The bike builder loads all your tagged products with variants
- This can be 100+ products, which could slow down other pages
- A dedicated page provides a focused, distraction-free experience
- Better for SEO and conversion tracking

**How to create a dedicated page:**
1. Go to Shopify Admin → Online Store → Pages
2. Click "Add page"
3. Title: "Build Your Dream Bike" (or similar)
4. Click "Customize" to open the theme editor
5. Add the "Bike Builder" block to the page
6. Save and publish
7. Add a link to your main navigation menu

### Q: Can I add the bike builder to my homepage or product pages?
**A:** While technically possible, we **strongly discourage** this for performance reasons. The bike builder makes API calls and loads all products on page load, which can significantly slow down high-traffic pages. Use a dedicated page instead.

### Q: How do I tag my products for the bike builder?
**A:** Tag your products with the bike builder category tags:
- `bike-builder-frame` for frames
- `bike-builder-fork` for forks
- `bike-builder-handlebar` for handlebars
- etc.

You can customize the tag prefix in Settings → Tag Prefix (default is `bike-builder-`).

### Q: Which categories are available?
**A:** The app supports 14 bike part categories:
- Frame, Fork, Stem, Handlebar, Grips, Brakes, Cranks, Bottom Bracket, Pedals, Seat, Seatpost, Seatpost Clamp, Wheels, Tires

You can enable/disable specific categories in Settings → Categories.

---

## Products & Variants

### Q: How do I add products to the bike builder?
**A:** Simply tag your products with the appropriate category tag (e.g., `bike-builder-frame`). The bike builder automatically displays all active products with matching tags.

### Q: Do product variants work?
**A:** Yes! The bike builder automatically shows dropdown selectors for products with multiple variants (size, color, etc.). Customers can select their preferred variant, and the price updates accordingly.

### Q: What if a product is out of stock?
**A:** Out-of-stock variants are automatically hidden from the bike builder. If all variants are out of stock, the product won't appear.

### Q: Can I limit how many products show per category?
**A:** Currently, the app shows up to 20 products per category. If you have more than 20, consider using more specific tags or creating sub-categories.

### Q: What about wheelsets vs individual wheels?
**A:** You can tag products either way:
- Complete wheelsets: Tag as `bike-builder-wheel`
- Individual components (hubs, rims, spokes): Use the same `bike-builder-wheel` tag, or create custom categories if you enable merchant customization

---

## Performance & Speed

### Q: Will the bike builder slow down my site?
**A:** If used on a **dedicated page**, no. The bike builder:
- Has a 5-minute API cache to reduce server load
- Only loads when customers visit the dedicated page
- Uses lazy-loaded images
- Is optimized for performance

However, if you add it to **every page** (header, footer, homepage), it will slow down your site. Always use a dedicated page.

### Q: How can I improve bike builder performance?
**A:**
1. **Use a dedicated page** (most important!)
2. Keep the number of products reasonable (under 200 total)
3. Optimize product images (compress to under 200KB each)
4. Enable only the categories you actually sell
5. Use the accordion mode (default) instead of showing all categories at once

### Q: Does the bike builder work on mobile?
**A:** Yes! The bike builder is fully responsive and works great on mobile, tablet, and desktop.

---

## Customization

### Q: Can I customize the colors and branding?
**A:** Yes! Go to Settings → Theme Customization to change:
- Primary, secondary, and accent colors
- Heading and body fonts
- Header text and tagline
- Button style (rounded vs. square)

### Q: Can I change the tag prefix from "bike-builder-"?
**A:** Yes! Go to Settings → Tag Prefix and change it to anything you want (e.g., `custom-`, `parts-`, etc.). Just make sure to retag your products with the new prefix.

### Q: Can I disable certain categories?
**A:** Yes! Go to Settings → Categories and uncheck any categories you don't want to display. For example, if you don't sell bottom brackets, disable that category.

---

## Shopping Cart & Checkout

### Q: How does "Add to Cart" work?
**A:** When customers click "Add to Cart", all selected parts (with their chosen variants) are added to the Shopify cart. Customers then proceed to checkout normally.

### Q: Can customers save their build for later?
**A:** Not currently. This is a planned feature for a future update. For now, builds are session-based only.

### Q: What if a customer selects incompatible parts?
**A:** The bike builder doesn't currently validate part compatibility. You should include guidance on your product pages or in the bike builder description to help customers choose compatible parts.

---

## Troubleshooting

### Q: The bike builder shows "Failed to load bike builder"
**A:** This usually means:
1. The app isn't properly installed (try reinstalling)
2. Your products don't have the correct tags
3. All your products are out of stock
4. There's a permissions issue (check that the app has `read_products` scope)

Try these steps:
1. Check that you have products tagged with `bike-builder-*` tags
2. Verify products are active and published
3. Check Settings → Categories to ensure categories are enabled
4. Try refreshing the page

### Q: Products aren't showing up in the bike builder
**A:** Check:
1. Products are tagged correctly (e.g., `bike-builder-frame`)
2. Products are **published** and **active**
3. At least one variant is **available for sale**
4. The category is **enabled** in Settings → Categories
5. The tag prefix matches (check Settings → Tag Prefix)

### Q: Variant dropdowns aren't working
**A:** Make sure:
1. Your product has multiple variants (not just "Default Title")
2. Variants have distinct titles (not all named the same)
3. At least one variant is available for sale

### Q: The bike builder looks broken or unstyled
**A:**
1. Clear your browser cache (Cmd+Shift+R or Ctrl+Shift+R)
2. Make sure the theme extension is properly installed
3. Check the browser console for JavaScript errors
4. Try in an incognito/private browsing window

---

## Support & Billing

### Q: How do I get support?
**A:** Contact us at [YOUR SUPPORT EMAIL] or visit our support portal at [YOUR SUPPORT URL]. We typically respond within 24 hours on business days.

### Q: Is there a free trial?
**A:** [Specify your pricing/trial policy - e.g., "Yes, the app is free to install and use for 14 days."]

### Q: Can I uninstall the app?
**A:** Yes, you can uninstall at any time from Settings → Apps and sales channels. Your product tags will remain, but the bike builder block will stop working.

### Q: What happens to my data if I uninstall?
**A:** We automatically delete your app settings and configuration data within 48 hours of uninstallation, in compliance with GDPR requirements.

---

## Best Practices

### Q: What's the best way to set up the bike builder?
**A:** Follow these best practices:
1. **Create a dedicated page** (`/pages/build-your-bike`)
2. Add clear product descriptions and images
3. Use consistent variant naming (e.g., "Small", "Medium", "Large" not "S", "Md", "L")
4. Enable only the categories you actually sell
5. Keep total products under 200 for best performance
6. Test the full customer journey (select parts → add to cart → checkout)
7. Add a prominent link in your main navigation

### Q: How should I organize my products?
**A:**
- Use clear, descriptive product titles
- Add high-quality images (1200x1200px recommended)
- Include detailed descriptions on product pages
- Use variant titles that make sense in dropdowns
- Price variants appropriately (price shows in dropdown)
- Tag products consistently

### Q: Should I offer every possible bike part?
**A:** No! Start with the essentials:
- Frame (required)
- Fork (required)
- Wheels (required)
- Handlebars, stem, brakes, cranks, pedals (common)
- Add others as needed

Too many categories can overwhelm customers. Enable only what you actually stock.

---

## Future Features

### Q: What features are coming soon?
**A:** We're working on:
- Wizard mode (step-by-step guided flow)
- Save builds for later
- Share builds via URL
- Part compatibility checking
- Build recommendations
- Customer build gallery

### Q: Can I request a feature?
**A:** Absolutely! Email feature requests to [YOUR EMAIL]. We prioritize based on merchant demand.

---

**Still have questions?** Contact our support team at [YOUR SUPPORT EMAIL]
