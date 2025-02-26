-- CreateTable
CREATE TABLE "FinanceRecord" (
    "id" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "taxNumber" DECIMAL(10,2) NOT NULL,
    "year" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "taxpayerId" TEXT NOT NULL,
    "uploadTime" TIMESTAMP(3) NOT NULL,
    "processStatus" TEXT NOT NULL,
    "taxpayerName" TEXT NOT NULL,
    "processType" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "processTime" TIMESTAMP(3),

    CONSTRAINT "FinanceRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FinanceRecord_taxpayerId_idx" ON "FinanceRecord"("taxpayerId");

-- CreateIndex
CREATE INDEX "FinanceRecord_processStatus_idx" ON "FinanceRecord"("processStatus");

-- CreateIndex
CREATE INDEX "FinanceRecord_uploadTime_idx" ON "FinanceRecord"("uploadTime");
