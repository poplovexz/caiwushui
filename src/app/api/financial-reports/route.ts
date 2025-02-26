import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const enterpriseName = searchParams.get("enterpriseName")
    const processStatus = searchParams.get("processStatus")
    const reportType = searchParams.get("reportType")

    const where = {
      AND: [
        startDate ? {
          uploadTime: {
            gte: new Date(startDate)
          }
        } : {},
        endDate ? {
          uploadTime: {
            lte: new Date(endDate)
          }
        } : {},
        enterpriseName ? {
          enterprise: {
            name: {
              contains: enterpriseName
            }
          }
        } : {},
        processStatus ? {
          processStatus
        } : {},
        reportType ? {
          reportType
        } : {}
      ].filter(condition => Object.keys(condition).length > 0)
    }

    console.log("查询条件:", where)
    console.log("Prisma 实例:", prisma)

    const reports = await prisma.financialReport.findMany({
      where,
      orderBy: {
        uploadTime: "desc"
      },
      include: {
        enterprise: {
          select: {
            name: true,
            unifiedSocialCode: true
          }
        }
      }
    })

    return NextResponse.json(reports)
  } catch (error) {
    console.error("获取财报记录失败:", error)
    return NextResponse.json(
      { error: "获取财报记录失败" },
      { status: 500 }
    )
  }
}
