import db from "../db.server";

/**
 * App Proxy Route: Create cart with selected bike parts
 * This route is accessed via app proxy: yourstore.com/apps/bike-builder/api/cart
 *
 * Uses Shopify Storefront API to create a cart and return checkout URL
 */
export const action = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const shop = url.searchParams.get('shop');

    if (!shop) {
      return Response.json(
        { error: "Missing shop parameter" },
        { status: 400 }
      );
    }

    // Get the offline access token from the database
    const session = await db.session.findFirst({
      where: { shop, isOnline: false }
    });

    if (!session) {
      return Response.json(
        { error: "Shop not authenticated" },
        { status: 401 }
      );
    }

    // Parse the selected parts from request body
    const body = await request.json();
    const { items } = body; // Array of { variantId, quantity }

    if (!items || items.length === 0) {
      return Response.json(
        { error: "No items to add to cart" },
        { status: 400 }
      );
    }

    // Create cart using Storefront API
    // We'll use the Admin API to get a Storefront Access Token first
    // Then use that token to create the cart

    // For now, use the simpler Ajax Cart API approach
    // which works with the shop's existing cart without needing Storefront API token

    // Transform variant IDs to the format needed for Ajax Cart API
    const cartLines = items.map(item => ({
      id: item.variantId,
      quantity: item.quantity || 1
    }));

    // Return the cart data - the client will handle adding to cart using Ajax API
    return Response.json({
      success: true,
      items: cartLines,
      // The client will use /cart/add.js endpoint
      message: "Cart items prepared"
    }, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      }
    });

  } catch (error) {
    console.error("Error creating cart:", error);
    return Response.json(
      { error: "Failed to create cart", details: error.message },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        }
      }
    );
  }
};

// Handle OPTIONS requests for CORS
export const loader = async () => {
  return Response.json(
    { error: "Method not allowed. Use POST." },
    {
      status: 405,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Content-Type": "application/json"
      }
    }
  );
};
