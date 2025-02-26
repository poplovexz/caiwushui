import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const enterpriseName = searchParams.get("enterpriseName")
    const status = searchParams.get("status")

    const where = {
      AND: [
        startDate ? {
          taxPeriod: {
            gte: startDate
          }
        } : {},
        endDate ? {
          taxPeriod: {
            lte: endDate
          }
        } : {},
        enterpriseName ? {
          enterprise: {
            name: {
              contains: enterpriseName
            }
          }
        } : {},
        status ? {
          status: {
            equals: status
          }
        } : {}
      ].filter(condition => Object.keys(condition).length > 0)
    }

    const refunds = await prisma.taxRefund.findMany({
      where,
      orderBy: {
        taxPeriod: "desc"
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

    return NextResponse.json(refunds)
  } catch (error) {
    console.error("获取返税记录失败:", error)
    return NextResponse.json(
      { error: "获取返税记录失败" },
      { status: 500 }
    )
  }
}
