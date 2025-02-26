-- CreateTable
CREATE TABLE "TaxPaymentFile" (
    "id" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "processStatus" TEXT NOT NULL,
    "processTime" TIMESTAMP(3),
    "serialNumber" TEXT NOT NULL,
    "enterpriseId" TEXT NOT NULL,
    "taxpayerId" TEXT NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "uploadTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "filePath" TEXT NOT NULL,
    "remarks" TEXT,

    CONSTRAINT "TaxPaymentFile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TaxPaymentFile_enterpriseId_idx" ON "TaxPaymentFile"("enterpriseId");

-- CreateIndex
CREATE INDEX "TaxPaymentFile_processStatus_idx" ON "TaxPaymentFile"("processStatus");

-- CreateIndex
CREATE INDEX "TaxPaymentFile_uploadTime_idx" ON "TaxPaymentFile"("uploadTime");

-- AddForeignKey
ALTER TABLE "TaxPaymentFile" ADD CONSTRAINT "TaxPaymentFile_enterpriseId_fkey" FOREIGN KEY ("enterpriseId") REFERENCES "Enterprise"("id") ON DELETE CASCADE ON UPDATE CASCADE;
