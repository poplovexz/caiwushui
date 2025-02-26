import { Suspense } from "react"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { TaxOverview } from "@/components/tax/tax-overview"
import { db } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth/config/auth-options"

async function getTaxData() {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error("Unauthorized")
  }

  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1

  // 获取所有企业的税收记录
  const records = await db.taxRecord.findMany({
    where: {
      OR: [
        {
          year: currentYear,
          month: currentMonth,
        },
        {
          year: currentYear,
          month: currentMonth - 1,
        },
      ],
    },
    include: {
      enterprise: {
        select: {
          id: true,
          name: true,
          unifiedSocialCode: true,
        },
      },
    },
    orderBy: [
      { year: "desc" },
      { month: "desc" },
      { enterprise: { name: "asc" } },
    ],
  })

  // 获取未缴纳税收的企业
  const unpaidEnterprises = await db.enterprise.findMany({
    where: {
      NOT: {
        taxRecords: {
          some: {
            year: currentYear,
            month: currentMonth,
          },
        },
      },
    },
    select: {
      id: true,
      name: true,
      unifiedSocialCode: true,
    },
  })

  // 计算统计数据
  const statistics = {
    totalTaxAmount: records.reduce((sum, record) => sum + record.taxAmount, 0),
    totalPaidAmount: records.reduce((sum, record) => sum + record.paidAmount, 0),
    unpaidCount: records.filter(record => record.paymentStatus === "未缴纳").length + unpaidEnterprises.length,
    partiallyPaidCount: records.filter(record => record.paymentStatus === "部分缴纳").length,
    fullyPaidCount: records.filter(record => record.paymentStatus === "已缴纳").length,
  }

  return {
    records,
    unpaidEnterprises,
    statistics,
  }
}

export default async function TaxPage() {
  const data = await getTaxData()

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <Heading
          title="税收管理"
          description="查看和管理所有企业的税收情况。"
        />
      </div>
      <Separator />
      <Suspense fallback={<div>加载中...</div>}>
        <TaxOverview
          records={data.records}
          unpaidEnterprises={data.unpaidEnterprises}
          statistics={data.statistics}
        />
      </Suspense>
    </div>
  )
}
