/*
  Warnings:

  - Added the required column `enterpriseId` to the `FinanceRecord` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FinanceRecord" ADD COLUMN     "enterpriseId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "FinanceRecord_enterpriseId_idx" ON "FinanceRecord"("enterpriseId");

-- AddForeignKey
ALTER TABLE "FinanceRecord" ADD CONSTRAINT "FinanceRecord_enterpriseId_fkey" FOREIGN KEY ("enterpriseId") REFERENCES "Enterprise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
