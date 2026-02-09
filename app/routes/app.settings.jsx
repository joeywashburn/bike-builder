import { useState, useCallback } from "react";
import { useLoaderData, useFetcher } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { getSettings } from "../services/settings.server";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);

  // Load settings from database
  const settings = await getSettings(session.shop);

  return {
    settings: {
      configurationType: 'tags', // Always use tags for now
      ...settings
    }
  };
};

export const action = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();

  const settingsData = JSON.parse(formData.get("settings"));

  // Save settings to database
  const { saveSettings } = await import("../services/settings.server");
  await saveSettings(session.shop, settingsData);

  return { success: true, settings: settingsData };
};

export default function Settings() {
  const { settings: initialSettings } = useLoaderData();
  const fetcher = useFetcher();
  const shopify = useAppBridge();

  const [configurationType, setConfigurationType] = useState(initialSettings.configurationType);
  const [tagPrefix, setTagPrefix] = useState(initialSettings.tagPrefix);
  const [categories, setCategories] = useState(initialSettings.categories);
  const [headerText, setHeaderText] = useState(initialSettings.theme.headerText);
  const [tagline, setTagline] = useState(initialSettings.theme.tagline);
  const [primaryColor, setPrimaryColor] = useState(initialSettings.theme.primaryColor);

  // Build fee state
  const [buildFeeEnabled, setBuildFeeEnabled] = useState(initialSettings.buildFee?.enabled || false);
  const [buildFeeProductId, setBuildFeeProductId] = useState(initialSettings.buildFee?.productId || '');
  const [buildFeeAmount, setBuildFeeAmount] = useState(initialSettings.buildFee?.amount || 0);
  const [freeThresholdEnabled, setFreeThresholdEnabled] = useState(initialSettings.buildFee?.freeThresholdEnabled || false);
  const [freeThresholdAmount, setFreeThresholdAmount] = useState(initialSettings.buildFee?.freeThresholdAmount || 0);

  const toggleCategory = (categoryName) => {
    setCategories(categories.map(cat =>
      cat.name === categoryName ? { ...cat, enabled: !cat.enabled } : cat
    ));
  };

  const handleSave = useCallback(() => {
    const settings = {
      configurationType,
      tagPrefix,
      categories,
      theme: {
        primaryColor,
        headerText,
        tagline,
      },
      buildFee: {
        enabled: buildFeeEnabled,
        productId: buildFeeProductId,
        amount: parseFloat(buildFeeAmount) || 0,
        freeThresholdEnabled,
        freeThresholdAmount: parseFloat(freeThresholdAmount) || 0,
      }
    };

    fetcher.submit(
      { settings: JSON.stringify(settings) },
      { method: "POST" }
    );
  }, [configurationType, tagPrefix, categories, primaryColor, headerText, tagline, buildFeeEnabled, buildFeeProductId, buildFeeAmount, freeThresholdEnabled, freeThresholdAmount, fetcher]);

  // Show success toast when saved
  if (fetcher.data?.success) {
    shopify.toast.show("Settings saved successfully!");
  }

  return (
    <s-page heading="Bike Builder Settings">
      <s-button slot="primary-action" onClick={handleSave} loading={fetcher.state === "submitting"}>
        Save Settings
      </s-button>

      <s-section heading="Product Configuration">
        <s-paragraph>
          Choose how products are organized for the bike builder. We recommend using tags for simplicity.
        </s-paragraph>

        <s-stack direction="block" gap="large">
          <s-radio-group label="Configuration Method" value={configurationType} onChange={(e) => setConfigurationType(e.target.value)}>
            <s-radio value="tags" label="Use Product Tags (Recommended)" />
            <s-radio value="collections" label="Use Collections" />
          </s-radio-group>

          {configurationType === 'tags' && (
            <s-box padding="base" borderWidth="base" borderRadius="base">
              <s-stack direction="block" gap="base">
                <s-heading>Tag Configuration</s-heading>
                <s-paragraph>
                  <strong>Default works out of the box!</strong> Just tag your products with:
                  <strong> bike-builder-frame</strong>, <strong>bike-builder-forks</strong>, etc.
                </s-paragraph>
                <s-paragraph>
                  Advanced: Customize the prefix below if you need a different naming convention.
                </s-paragraph>

                <s-text-field
                  label="Tag Prefix (Advanced)"
                  value={tagPrefix}
                  onChange={(e) => setTagPrefix(e.target.value)}
                  helpText="Default: bike-builder- (recommended for most merchants)"
                />

                <s-box background="subdued" padding="base" borderRadius="base">
                  <s-heading>Choose which parts to show:</s-heading>
                  <s-paragraph variant="subdued">
                    Enable the categories you want in your bike builder. Only enabled categories will appear.
                  </s-paragraph>

                  <s-stack direction="block" gap="tight">
                    {categories.map(category => (
                      <div key={category.name} style={{ padding: '8px 0' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={category.enabled}
                            onChange={() => toggleCategory(category.name)}
                            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                          />
                          <span>
                            <strong>{category.label}</strong> - Tag: <code>{tagPrefix}{category.name}</code>
                          </span>
                        </label>
                      </div>
                    ))}
                  </s-stack>

                  <s-box padding="base" borderRadius="base" background="surface" style={{ marginTop: '16px' }}>
                    <s-text variant="bodySm" tone="subdued">
                      💡 Tip: For wheelsets, use <code>{tagPrefix}wheel</code>. For individual components,
                      add custom categories like <code>{tagPrefix}hub</code>, <code>{tagPrefix}rim</code>, etc.
                    </s-text>
                  </s-box>
                </s-box>
              </s-stack>
            </s-box>
          )}

          {configurationType === 'collections' && (
            <s-box padding="base" borderWidth="base" borderRadius="base">
              <s-stack direction="block" gap="base">
                <s-heading>Collection Configuration</s-heading>
                <s-paragraph>
                  Create collections for each bike part category and select them below.
                  (Collection selector coming soon - use tags for now)
                </s-paragraph>
              </s-stack>
            </s-box>
          )}
        </s-stack>
      </s-section>

      <s-section heading="Theme Customization">
        <s-stack direction="block" gap="base">
          <s-text-field
            label="Header Text"
            value={headerText}
            onChange={(e) => setHeaderText(e.target.value)}
            helpText="Main heading displayed on the bike builder"
          />

          <s-text-field
            label="Tagline"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            helpText="Subtitle text displayed below the header"
          />

          <s-text-field
            label="Primary Color"
            value={primaryColor}
            onChange={(e) => setPrimaryColor(e.target.value)}
            helpText="Hex color code (e.g., #4F46E5)"
            type="color"
          />
        </s-stack>
      </s-section>

      <s-section heading="Build Fee Configuration">
        <s-paragraph>
          Charge customers an assembly fee for professional bike building. Optionally waive the fee for high-value orders.
        </s-paragraph>

        <s-stack direction="block" gap="base">
          <div style={{ padding: '8px 0' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={buildFeeEnabled}
                onChange={(e) => setBuildFeeEnabled(e.target.checked)}
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
              <span><strong>Enable build/assembly fee</strong></span>
            </label>
          </div>

          {buildFeeEnabled && (
            <s-box padding="base" borderWidth="base" borderRadius="base">
              <s-stack direction="block" gap="base">
                <s-text-field
                  label="Build Fee Amount"
                  type="number"
                  value={buildFeeAmount}
                  onChange={(e) => setBuildFeeAmount(e.target.value)}
                  helpText="Amount to charge for professional assembly (e.g., 50.00)"
                  prefix="$"
                  step="0.01"
                  min="0"
                />

                <s-text-field
                  label="Build Fee Product ID"
                  value={buildFeeProductId}
                  onChange={(e) => setBuildFeeProductId(e.target.value)}
                  helpText="Create a 'Build Fee' product in your store and paste its ID here. Find it in the product URL: /products/12345678"
                  placeholder="e.g., gid://shopify/Product/12345678 or just 12345678"
                />

                <s-box padding="base" background="subdued" borderRadius="base">
                  <s-stack direction="block" gap="tight">
                    <div style={{ padding: '8px 0' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={freeThresholdEnabled}
                          onChange={(e) => setFreeThresholdEnabled(e.target.checked)}
                          style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                        />
                        <span><strong>Waive fee for orders above a threshold</strong></span>
                      </label>
                    </div>

                    {freeThresholdEnabled && (
                      <s-text-field
                        label="Free Assembly Threshold"
                        type="number"
                        value={freeThresholdAmount}
                        onChange={(e) => setFreeThresholdAmount(e.target.value)}
                        helpText="Build total amount where assembly becomes free (e.g., 500.00 for 'Free assembly on orders $500+')"
                        prefix="$"
                        step="0.01"
                        min="0"
                      />
                    )}
                  </s-stack>
                </s-box>

                <s-box padding="base" background="info" borderRadius="base">
                  <s-text variant="bodySm">
                    💡 <strong>How it works:</strong> Create a product called "Professional Bike Assembly" priced at ${buildFeeAmount || 0}.
                    {freeThresholdEnabled && ` The fee will only be added if the build total is less than $${freeThresholdAmount || 0}.`}
                    {!freeThresholdEnabled && ' The fee will be added to every build.'}
                  </s-text>
                </s-box>
              </s-stack>
            </s-box>
          )}
        </s-stack>
      </s-section>

      <s-section slot="aside" heading="Quick Setup Guide">
        <s-stack direction="block" gap="base">
          <s-paragraph>
            <strong>Step 1:</strong> Tag your products
          </s-paragraph>
          <s-text variant="subdued">
            Add tags like bike-builder-frame, bike-builder-forks to your products
          </s-text>
          <s-paragraph>
            <strong>Step 2:</strong> Customize theme (optional)
          </s-paragraph>
          <s-text variant="subdued">
            Change colors and text to match your brand
          </s-text>
          <s-paragraph>
            <strong>Step 3:</strong> Add app block to your theme
          </s-paragraph>
          <s-text variant="subdued">
            Online Store → Themes → Customize → Add app block
          </s-text>
          <s-paragraph>
            <strong>Done!</strong> Your bike builder is live.
          </s-paragraph>
        </s-stack>
      </s-section>
    </s-page>
  );
}
