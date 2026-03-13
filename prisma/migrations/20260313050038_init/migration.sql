-- CreateTable
CREATE TABLE "Lead" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "npiNumber" TEXT NOT NULL,
    "organizationName" TEXT NOT NULL,
    "authorizedFirstName" TEXT,
    "authorizedLastName" TEXT,
    "authorizedTitle" TEXT,
    "authorizedPhone" TEXT,
    "phone" TEXT,
    "fax" TEXT,
    "addressLine1" TEXT,
    "addressLine2" TEXT,
    "city" TEXT,
    "state" TEXT NOT NULL DEFAULT 'TX',
    "zip" TEXT,
    "taxonomyCode" TEXT NOT NULL,
    "taxonomyDescription" TEXT NOT NULL,
    "enumerationDate" TEXT NOT NULL,
    "daysSinceRegistration" INTEGER,
    "websiteStatus" TEXT NOT NULL DEFAULT 'UNCHECKED',
    "websiteUrl" TEXT,
    "websiteDetails" TEXT,
    "leadScore" TEXT NOT NULL DEFAULT 'Unscored',
    "ghlPushed" BOOLEAN NOT NULL DEFAULT false,
    "ghlPushedAt" DATETIME,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "scrapeBatch" TEXT
);

-- CreateTable
CREATE TABLE "ScrapeRun" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "runDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'running',
    "totalFound" INTEGER NOT NULL DEFAULT 0,
    "newLeads" INTEGER NOT NULL DEFAULT 0,
    "duplicates" INTEGER NOT NULL DEFAULT 0,
    "hotLeads" INTEGER NOT NULL DEFAULT 0,
    "warmLeads" INTEGER NOT NULL DEFAULT 0,
    "coldLeads" INTEGER NOT NULL DEFAULT 0,
    "lookbackDays" INTEGER NOT NULL DEFAULT 30,
    "durationSeconds" REAL,
    "errorMessage" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Setting" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Lead_npiNumber_key" ON "Lead"("npiNumber");

-- CreateIndex
CREATE INDEX "Lead_leadScore_idx" ON "Lead"("leadScore");

-- CreateIndex
CREATE INDEX "Lead_websiteStatus_idx" ON "Lead"("websiteStatus");

-- CreateIndex
CREATE INDEX "Lead_enumerationDate_idx" ON "Lead"("enumerationDate");

-- CreateIndex
CREATE INDEX "Lead_taxonomyCode_idx" ON "Lead"("taxonomyCode");

-- CreateIndex
CREATE UNIQUE INDEX "Setting_key_key" ON "Setting"("key");
