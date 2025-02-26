import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json()
    const { id } = params

    if (!status || !["已通过", "已驳回"].includes(status)) {
      return NextResponse.json(
        { error: "无效的状态" },
        { status: 400 }
      )
    }

    const record = await db.versionRecord.update({
      where: { id },
      data: {
        status,
        reviewTime: new Date(),
        reviewResult: status,
      },
      include: {
        enterprise: {
          select: {
            name: true,
          },
        },
      },
    })

    return NextResponse.json(record)
  } catch (error) {
    console.error("[API] 审核版本记录失败:", error instanceof Error ? error.message : String(error))
    return NextResponse.json(
      { error: "审核失败" },
      { status: 500 }
    )
  }
}
