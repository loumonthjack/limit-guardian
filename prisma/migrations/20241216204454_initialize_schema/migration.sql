-- CreateTable
CREATE TABLE "Service" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,
    "rate_limit_period" TEXT NOT NULL,
    "rate_limit" INTEGER NOT NULL DEFAULT 0,
    "current_usage" INTEGER NOT NULL DEFAULT 0,
    "reset_at" DATETIME NOT NULL,
    "admin_email" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "last_notified" DATETIME
);

-- CreateIndex
CREATE UNIQUE INDEX "Service_name_key" ON "Service"("name");
