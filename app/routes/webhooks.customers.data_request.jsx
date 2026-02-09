import { authenticate } from "../shopify.server";

/**
 * GDPR Webhook: customers/data_request
 * Called when a customer requests their data
 * MANDATORY for Shopify App Store submission
 */
export const action = async ({ request }) => {
  const { shop, payload } = await authenticate.webhook(request);

  console.log(`[GDPR] Customer data request from shop: ${shop}`);
  console.log(`Customer ID: ${payload.customer.id}`);

  // Since we use session-based builds with no persistent customer data,
  // there's minimal data to return
  const customerData = {
    shop_domain: shop,
    customer_id: payload.customer.id,
    customer_email: payload.customer.email,
    data: {
      saved_bike_builds: [], // None - we use session-based builds
      preferences: {}, // None stored
      note: "This app uses session-based bike building with no persistent customer data storage."
    },
    generated_at: new Date().toISOString()
  };

  return Response.json(customerData, { status: 200 });
};
