-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shop" TEXT NOT NULL,
    "tagPrefix" TEXT NOT NULL DEFAULT 'bike-builder-',
    "categoriesJson" TEXT NOT NULL DEFAULT '[]',
    "primaryColor" TEXT NOT NULL DEFAULT '#4F46E5',
    "headerText" TEXT NOT NULL DEFAULT '🚲 Build Your Dream Bike',
    "tagline" TEXT NOT NULL DEFAULT 'Select your parts and create the perfect ride',
    "buildFeeEnabled" BOOLEAN NOT NULL DEFAULT false,
    "buildFeeProductId" TEXT,
    "buildFeeAmount" REAL NOT NULL DEFAULT 0,
    "freeThresholdEnabled" BOOLEAN NOT NULL DEFAULT false,
    "freeThresholdAmount" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Settings" ("categoriesJson", "createdAt", "headerText", "id", "primaryColor", "shop", "tagPrefix", "tagline", "updatedAt") SELECT "categoriesJson", "createdAt", "headerText", "id", "primaryColor", "shop", "tagPrefix", "tagline", "updatedAt" FROM "Settings";
DROP TABLE "Settings";
ALTER TABLE "new_Settings" RENAME TO "Settings";
CREATE UNIQUE INDEX "Settings_shop_key" ON "Settings"("shop");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
