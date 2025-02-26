import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const enterpriseName = searchParams.get("enterpriseName")
    const processStatus = searchParams.get("processStatus")

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
          taxpayerName: {
            contains: enterpriseName
          }
        } : {},
        processStatus ? {
          processStatus: processStatus
        } : {}
      ]
    }

    const records = await prisma.financeRecord.findMany({
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

    return NextResponse.json(records)
  } catch (error) {
    console.error("获取财税记录失败:", error)
    return NextResponse.json(
      { error: "获取财税记录失败" },
      { status: 500 }
    )
  }
}
