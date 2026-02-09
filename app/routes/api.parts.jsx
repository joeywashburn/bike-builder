import { authenticate } from "../shopify.server";
import { getSettings, getEnabledCategories } from "../services/settings.server";

/**
 * API Route: Fetch bike parts by tags
 * Used by the storefront bike builder to get products for each category
 */
export const loader = async ({ request }) => {
  try {
    // For now, use admin auth for testing
    // TODO: Change to app proxy auth for production storefront access
    const { admin, session } = await authenticate.admin(request);

    // Load settings from database
    const settings = await getSettings(session.shop);
    const tagPrefix = settings.tagPrefix;

    // Get only enabled categories
    const categories = await getEnabledCategories(session.shop);

    const parts = {};

    // Fetch products for each category
    for (const category of categories) {
      const tag = `${tagPrefix}${category}`;

      // GraphQL query to get products by tag
      const response = await admin.graphql(
        `#graphql
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
                  variants(first: 1) {
                    edges {
                      node {
                        id
                        price
                        availableForSale
                      }
                    }
                  }
                }
              }
            }
          }`,
        {
          variables: {
            query: `tag:${tag} AND status:active`
          }
        }
      );

      const data = await response.json();
      const products = data.data?.products?.edges || [];

      // Transform to simplified format
      parts[`${category}s`] = products
        .filter(({ node }) => node.variants.edges[0]?.node.availableForSale)
        .map(({ node }) => ({
          id: node.id,
          title: node.title,
          handle: node.handle,
          image: node.featuredImage?.url,
          price: parseFloat(node.variants.edges[0]?.node.price),
          variantId: node.variants.edges[0]?.node.id
        }));
    }

    return Response.json(parts, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=300"
      }
    });

  } catch (error) {
    console.error("Error fetching parts:", error);
    return Response.json(
      { error: "Failed to fetch parts" },
      { status: 500 }
    );
  }
};
