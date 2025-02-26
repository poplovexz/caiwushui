-- CreateTable
CREATE TABLE "VersionRecord" (
    "id" TEXT NOT NULL,
    "enterpriseId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "uploadTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewTime" TIMESTAMP(3),
    "reviewResult" TEXT,
    "reviewComment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "VersionRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VersionRecord_enterpriseId_idx" ON "VersionRecord"("enterpriseId");

-- CreateIndex
CREATE INDEX "VersionRecord_status_idx" ON "VersionRecord"("status");

-- CreateIndex
CREATE INDEX "VersionRecord_uploadTime_idx" ON "VersionRecord"("uploadTime");

-- AddForeignKey
ALTER TABLE "VersionRecord" ADD CONSTRAINT "VersionRecord_enterpriseId_fkey" FOREIGN KEY ("enterpriseId") REFERENCES "Enterprise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
