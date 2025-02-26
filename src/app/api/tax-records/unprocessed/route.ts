import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // 获取未被计算返税的税收记录
    const records = await prisma.taxRecord.findMany({
      where: {
        // 只获取已缴纳的税收记录
        paymentStatus: "已缴纳",
        // 排除已经计算过返税的记录
        NOT: {
          taxRefund: {
            some: {}
          }
        }
      },
      include: {
        enterprise: {
          select: {
            name: true,
            unifiedSocialCode: true
          }
        }
      },
      orderBy: {
        paymentDate: "asc"
      }
    })

    return NextResponse.json(records)
  } catch (error) {
    console.error("获取未处理税收记录失败:", error)
    return NextResponse.json(
      { error: "获取未处理税收记录失败" },
      { status: 500 }
    )
  }
}
