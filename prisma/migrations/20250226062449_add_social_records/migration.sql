-- CreateTable
CREATE TABLE "SocialRecord" (
    "id" TEXT NOT NULL,
    "enterpriseId" TEXT NOT NULL,
    "employeeName" TEXT NOT NULL,
    "idNumber" TEXT NOT NULL,
    "insuranceType" TEXT NOT NULL,
    "baseAmount" DOUBLE PRECISION NOT NULL,
    "personalAmount" DOUBLE PRECISION NOT NULL,
    "companyAmount" DOUBLE PRECISION NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "paymentStatus" TEXT NOT NULL,
    "paymentDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "SocialRecord_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SocialRecord" ADD CONSTRAINT "SocialRecord_enterpriseId_fkey" FOREIGN KEY ("enterpriseId") REFERENCES "Enterprise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
