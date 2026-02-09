import { useLoaderData } from "react-router";
import { authenticate } from "../shopify.server";
import { getSettings, getEnabledCategories } from "../services/settings.server";

export const loader = async ({ request }) => {
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

    console.log(`Fetching products for category: ${category}, tag: ${tag}`);

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

    console.log(`Category ${category}: found ${products.length} products`);

    // Transform to simplified format
    // TODO: Re-enable availability filter for production
    parts[`${category}s`] = products
      // .filter(({ node }) => node.variants.edges[0]?.node.availableForSale) // Temporarily disabled for testing
      .map(({ node }) => ({
        id: node.id,
        title: node.title,
        handle: node.handle,
        image: node.featuredImage?.url,
        price: parseFloat(node.variants.edges[0]?.node.price),
        variantId: node.variants.edges[0]?.node.id
      }));
  }

  return { parts, tagPrefix };
};

export default function TestAPI() {
  const { parts, tagPrefix } = useLoaderData();

  const totalProducts = Object.values(parts).reduce((sum, category) => sum + category.length, 0);

  return (
    <s-page heading="API Test - Product Fetch">
      <s-section>
        <s-paragraph>
          Testing product fetch with tag prefix: <code>{tagPrefix}</code>
        </s-paragraph>
        <s-paragraph>
          <strong>Total products found: {totalProducts}</strong>
        </s-paragraph>
      </s-section>

      {Object.entries(parts).map(([category, products]) => (
        <s-section key={category} heading={`${category} (${products.length} products)`}>
          {products.length === 0 ? (
            <s-paragraph>
              No products found with tag: <code>{tagPrefix}{category.replace(/s$/, '')}</code>
            </s-paragraph>
          ) : (
            <s-stack direction="block" gap="base">
              {products.map((product) => (
                <s-box
                  key={product.id}
                  padding="base"
                  borderWidth="base"
                  borderRadius="base"
                >
                  <s-stack direction="inline" gap="base" align="center">
                    {product.image && (
                      <img
                        src={product.image}
                        alt={product.title}
                        style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                    )}
                    <s-stack direction="block" gap="tight">
                      <s-text variant="headingSm">{product.title}</s-text>
                      <s-text variant="bodySm">${product.price.toFixed(2)}</s-text>
                      <s-text variant="bodySm" tone="subdued">
                        Variant ID: {product.variantId}
                      </s-text>
                    </s-stack>
                  </s-stack>
                </s-box>
              ))}
            </s-stack>
          )}
        </s-section>
      ))}

      <s-section slot="aside" heading="Debug Info">
        <s-box padding="base" borderWidth="base" borderRadius="base" background="subdued">
          <pre style={{ margin: 0, fontSize: '12px', overflow: 'auto' }}>
            {JSON.stringify(parts, null, 2)}
          </pre>
        </s-box>
      </s-section>
    </s-page>
  );
}
