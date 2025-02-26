import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const pageSize = parseInt(searchParams.get("pageSize") || "10")
    const skip = (page - 1) * pageSize

    const [records, total] = await Promise.all([
      db.versionRecord.findMany({
        where: {
          deletedAt: null,
        },
        include: {
          enterprise: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          uploadTime: "desc",
        },
        skip,
        take: pageSize,
      }),
      db.versionRecord.count({
        where: {
          deletedAt: null,
        },
      }),
    ])

    return NextResponse.json({
      records,
      total,
      pageSize,
      page,
    })
  } catch (error) {
    console.error("[API] 获取版本记录失败:", error instanceof Error ? error.message : String(error))
    return NextResponse.json(
      { error: "获取版本记录失败" },
      { status: 500 }
    )
  }
}
