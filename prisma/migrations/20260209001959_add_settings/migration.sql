-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shop" TEXT NOT NULL,
    "tagPrefix" TEXT NOT NULL DEFAULT 'bike-builder-',
    "categoriesJson" TEXT NOT NULL DEFAULT '[]',
    "primaryColor" TEXT NOT NULL DEFAULT '#4F46E5',
    "headerText" TEXT NOT NULL DEFAULT '🚲 Build Your Dream Bike',
    "tagline" TEXT NOT NULL DEFAULT 'Select your parts and create the perfect ride',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Settings_shop_key" ON "Settings"("shop");
