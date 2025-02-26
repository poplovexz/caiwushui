-- CreateTable
CREATE TABLE "TaxRefund" (
    "id" TEXT NOT NULL,
    "taxNumber" TEXT NOT NULL,
    "taxPeriod" TEXT NOT NULL,
    "taxAmount" DECIMAL(15,2) NOT NULL,
    "baseAmount" DECIMAL(15,2) NOT NULL,
    "refundRate" DECIMAL(5,2) NOT NULL,
    "refundAmount" DECIMAL(15,2) NOT NULL,
    "personalAmount" DECIMAL(15,2) NOT NULL,
    "companyAmount" DECIMAL(15,2) NOT NULL,
    "landAmount" DECIMAL(15,2) NOT NULL,
    "propertyAmount" DECIMAL(15,2) NOT NULL,
    "otherAmount" DECIMAL(15,2) NOT NULL,
    "totalAmount" DECIMAL(15,2) NOT NULL,
    "status" TEXT NOT NULL,
    "enterpriseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaxRefund_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxRefundConfig" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rate" DECIMAL(5,2) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaxRefundConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TaxRefund_enterpriseId_idx" ON "TaxRefund"("enterpriseId");

-- CreateIndex
CREATE INDEX "TaxRefund_status_idx" ON "TaxRefund"("status");

-- CreateIndex
CREATE INDEX "TaxRefund_taxPeriod_idx" ON "TaxRefund"("taxPeriod");

-- CreateIndex
CREATE INDEX "TaxRefundConfig_name_idx" ON "TaxRefundConfig"("name");

-- CreateIndex
CREATE INDEX "TaxRefundConfig_isActive_idx" ON "TaxRefundConfig"("isActive");

-- AddForeignKey
ALTER TABLE "TaxRefund" ADD CONSTRAINT "TaxRefund_enterpriseId_fkey" FOREIGN KEY ("enterpriseId") REFERENCES "Enterprise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
