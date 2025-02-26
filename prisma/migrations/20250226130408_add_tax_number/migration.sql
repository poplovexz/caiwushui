/*
  Warnings:

  - Added the required column `taxNumber` to the `TaxRecord` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TaxRecord" ADD COLUMN     "taxNumber" TEXT NOT NULL,
ADD COLUMN     "taxRefundId" TEXT;

-- CreateIndex
CREATE INDEX "TaxRecord_taxRefundId_idx" ON "TaxRecord"("taxRefundId");

-- AddForeignKey
ALTER TABLE "TaxRecord" ADD CONSTRAINT "TaxRecord_taxRefundId_fkey" FOREIGN KEY ("taxRefundId") REFERENCES "TaxRefund"("id") ON DELETE SET NULL ON UPDATE CASCADE;
