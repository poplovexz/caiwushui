-- CreateTable
CREATE TABLE "FinancialReport" (
    "id" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "reportType" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "quarter" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "totalAssets" DECIMAL(15,2) NOT NULL,
    "totalLiability" DECIMAL(15,2) NOT NULL,
    "netAssets" DECIMAL(15,2) NOT NULL,
    "revenue" DECIMAL(15,2) NOT NULL,
    "profit" DECIMAL(15,2) NOT NULL,
    "uploadTime" TIMESTAMP(3) NOT NULL,
    "processStatus" TEXT NOT NULL,
    "processType" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "processTime" TIMESTAMP(3),
    "enterpriseId" TEXT NOT NULL,

    CONSTRAINT "FinancialReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FinancialReport_enterpriseId_idx" ON "FinancialReport"("enterpriseId");

-- CreateIndex
CREATE INDEX "FinancialReport_processStatus_idx" ON "FinancialReport"("processStatus");

-- CreateIndex
CREATE INDEX "FinancialReport_uploadTime_idx" ON "FinancialReport"("uploadTime");

-- CreateIndex
CREATE INDEX "FinancialReport_year_quarter_idx" ON "FinancialReport"("year", "quarter");

-- AddForeignKey
ALTER TABLE "FinancialReport" ADD CONSTRAINT "FinancialReport_enterpriseId_fkey" FOREIGN KEY ("enterpriseId") REFERENCES "Enterprise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
