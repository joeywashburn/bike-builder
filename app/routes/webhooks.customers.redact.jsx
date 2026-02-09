import { authenticate } from "../shopify.server";

/**
 * GDPR Webhook: customers/redact
 * Called when a customer requests deletion of their data
 * MANDATORY for Shopify App Store submission
 */
export const action = async ({ request }) => {
  const { shop, payload } = await authenticate.webhook(request);

  console.log(`[GDPR] Customer redact request from shop: ${shop}`);
  console.log(`Customer ID: ${payload.customer.id}`);

  // TODO: Delete any saved customer bike configurations
  // Since we're keeping it simple with session-based builds,
  // there's minimal customer data to delete

  return new Response(null, { status: 200 });
};
