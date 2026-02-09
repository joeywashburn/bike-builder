import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Default categories for new installations
const DEFAULT_CATEGORIES = [
  { name: 'frame', label: 'Frame', enabled: true },
  { name: 'fork', label: 'Fork', enabled: true },
  { name: 'stem', label: 'Stem', enabled: true },
  { name: 'handlebar', label: 'Handlebar', enabled: true },
  { name: 'grip', label: 'Grips', enabled: true },
  { name: 'brake', label: 'Brakes', enabled: true },
  { name: 'crank', label: 'Cranks', enabled: true },
  { name: 'bottom-bracket', label: 'Bottom Bracket', enabled: true },
  { name: 'pedal', label: 'Pedals', enabled: true },
  { name: 'seat', label: 'Seat', enabled: true },
  { name: 'seatpost', label: 'Seatpost', enabled: true },
  { name: 'seatpost-clamp', label: 'Seatpost Clamp', enabled: true },
  { name: 'wheel', label: 'Wheels', enabled: true },
  { name: 'tire', label: 'Tires', enabled: true },
];

/**
 * Get settings for a shop, create defaults if don't exist
 */
export async function getSettings(shop) {
  let settings = await prisma.settings.findUnique({
    where: { shop }
  });

  // Create default settings if none exist
  if (!settings) {
    settings = await prisma.settings.create({
      data: {
        shop,
        categoriesJson: JSON.stringify(DEFAULT_CATEGORIES),
      }
    });
  }

  // Parse categories from JSON
  const categories = JSON.parse(settings.categoriesJson || '[]');

  return {
    tagPrefix: settings.tagPrefix,
    categories: categories.length > 0 ? categories : DEFAULT_CATEGORIES,
    theme: {
      primaryColor: settings.primaryColor,
      headerText: settings.headerText,
      tagline: settings.tagline,
    },
    buildFee: {
      enabled: settings.buildFeeEnabled || false,
      productId: settings.buildFeeProductId || null,
      amount: settings.buildFeeAmount || 0,
      freeThresholdEnabled: settings.freeThresholdEnabled || false,
      freeThresholdAmount: settings.freeThresholdAmount || 0,
    }
  };
}

/**
 * Save settings for a shop
 */
export async function saveSettings(shop, settingsData) {
  const { tagPrefix, categories, theme, buildFee } = settingsData;

  const updateData = {
    tagPrefix: tagPrefix || 'bike-builder-',
    categoriesJson: JSON.stringify(categories || DEFAULT_CATEGORIES),
    primaryColor: theme?.primaryColor || '#4F46E5',
    headerText: theme?.headerText || '🚲 Build Your Dream Bike',
    tagline: theme?.tagline || 'Select your parts and create the perfect ride',
  };

  // Add build fee fields if provided
  if (buildFee !== undefined) {
    updateData.buildFeeEnabled = buildFee.enabled || false;
    updateData.buildFeeProductId = buildFee.productId || null;
    updateData.buildFeeAmount = buildFee.amount || 0;
    updateData.freeThresholdEnabled = buildFee.freeThresholdEnabled || false;
    updateData.freeThresholdAmount = buildFee.freeThresholdAmount || 0;
  }

  const settings = await prisma.settings.upsert({
    where: { shop },
    update: updateData,
    create: {
      shop,
      ...updateData
    }
  });

  return settings;
}

/**
 * Get enabled categories for a shop (for API use)
 */
export async function getEnabledCategories(shop) {
  const settings = await getSettings(shop);
  return settings.categories
    .filter(cat => cat.enabled)
    .map(cat => cat.name);
}
