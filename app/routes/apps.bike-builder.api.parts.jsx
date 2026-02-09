import db from "../db.server";
import { getSettings, getEnabledCategories } from "../services/settings.server";

/**
 * App Proxy Route: Fetch bike parts for storefront
 * This route is accessed via app proxy: yourstore.com/apps/bike-builder/api/parts
 *
 * App proxy adds these query params:
 * - shop: the shop domain
 * - logged_in_customer_id: if customer is logged in
 * - timestamp, signature: for verification
 */
export const loader = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const shop = url.searchParams.get('shop');

    if (!shop) {
      return Response.json(
        { error: "Missing shop parameter" },
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
          }
        }
      );
    }

    // Get the offline access token from the database
    const session = await db.session.findFirst({
      where: { shop, isOnline: false }
    });

    if (!session) {
      return Response.json(
        { error: "Shop not authenticated" },
        {
          status: 401,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
          }
        }
      );
    }

    // Load settings from database
    const settings = await getSettings(shop);
    const tagPrefix = settings.tagPrefix;

    // Get only enabled categories
    const categories = await getEnabledCategories(shop);

    const parts = {};

    // Fetch products for each category using Admin API
    for (const category of categories) {
      const tag = `${tagPrefix}${category}`;

      // Make GraphQL request to Shopify Admin API
      const response = await fetch(`https://${shop}/admin/api/2026-04/graphql.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': session.accessToken,
        },
        body: JSON.stringify({
          query: `
            query getProductsByTag($query: String!) {
              products(first: 20, query: $query) {
                edges {
                  node {
                    id
                    title
                    handle
                    featuredImage {
                      url
                    }
                    variants(first: 100) {
                      edges {
                        node {
                          id
                          title
                          price
                          availableForSale
                          selectedOptions {
                            name
                            value
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          `,
          variables: {
            query: `tag:${tag} AND status:active`
          }
        })
      });

      const data = await response.json();
      const products = data.data?.products?.edges || [];

      // Transform to simplified format
      parts[`${category}s`] = products
        .filter(({ node }) => node.variants.edges.length > 0)
        .map(({ node }) => {
          const variants = node.variants.edges
            .filter(({ node: variant }) => variant.availableForSale)
            .map(({ node: variant }) => ({
              id: variant.id,
              title: variant.title,
              price: parseFloat(variant.price),
              options: variant.selectedOptions
            }));

          return {
            id: node.id,
            title: node.title,
            handle: node.handle,
            image: node.featuredImage?.url,
            variants: variants,
            // Default to first available variant
            defaultPrice: variants[0]?.price || 0,
            defaultVariantId: variants[0]?.id
          };
        });
    }

    return Response.json({
      parts,
      buildFee: settings.buildFee || {
        enabled: false,
        productId: null,
        amount: 0,
        freeThresholdEnabled: false,
        freeThresholdAmount: 0
      }
    }, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=300"
      }
    });

  } catch (error) {
    console.error("Error fetching parts via app proxy:", error);
    return Response.json(
      { error: "Failed to fetch parts", details: error.message },
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
