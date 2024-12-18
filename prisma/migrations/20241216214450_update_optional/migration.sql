-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Service" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,
    "rate_limit_period" TEXT NOT NULL,
    "rate_limit" INTEGER NOT NULL DEFAULT 0,
    "current_usage" INTEGER NOT NULL DEFAULT 0,
    "reset_at" DATETIME NOT NULL,
    "admin_email" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME,
    "last_notified" DATETIME
);
INSERT INTO "new_Service" ("admin_email", "created_at", "current_usage", "description", "id", "is_enabled", "last_notified", "name", "rate_limit", "rate_limit_period", "reset_at", "updated_at") SELECT "admin_email", "created_at", "current_usage", "description", "id", "is_enabled", "last_notified", "name", "rate_limit", "rate_limit_period", "reset_at", "updated_at" FROM "Service";
DROP TABLE "Service";
ALTER TABLE "new_Service" RENAME TO "Service";
CREATE UNIQUE INDEX "Service_name_key" ON "Service"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
