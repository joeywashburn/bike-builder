import { authenticate } from "../shopify.server";

/**
 * GDPR Webhook: shop/redact
 * Called 48 hours after merchant uninstalls the app
 * MANDATORY for Shopify App Store submission
 */
export const action = async ({ request }) => {
  const { shop, payload } = await authenticate.webhook(request);

  console.log(`[GDPR] Shop redact request from shop: ${shop}`);

  // Safely access shop ID (handle both test and real webhooks)
  const shopId = payload?.shop_id || payload?.shop_domain || shop;
  console.log(`Shop ID: ${shopId}`);

  // TODO: Delete ALL shop data:
  // - Merchant settings (collections/tags configuration)
  // - Theme customization settings
  // - Any stored configurations
  // - Session data
  // For now using Prisma, we'd delete database records here

  return new Response(null, { status: 200 });
};
