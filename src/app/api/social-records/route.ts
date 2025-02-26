import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const pageSize = parseInt(searchParams.get("pageSize") || "10")
    const skip = (page - 1) * pageSize

    const [records, total] = await Promise.all([
      db.socialRecord.findMany({
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
          createdAt: "desc",
        },
        skip,
        take: pageSize,
      }),
      db.socialRecord.count({
        where: {
          deletedAt: null,
        },
      }),
    ])

    // 计算统计数据
    const [totalAmount, paidAmount, employeeCountResult] = await Promise.all([
      db.socialRecord.aggregate({
        where: {
          deletedAt: null,
        },
        _sum: {
          totalAmount: true,
        },
      }),
      db.socialRecord.aggregate({
        where: {
          deletedAt: null,
          paymentStatus: "已缴纳",
        },
        _sum: {
          totalAmount: true,
        },
      }),
      // 使用 groupBy 来计算唯一员工数量
      db.socialRecord.groupBy({
        by: ["employeeName", "idNumber"],
        where: {
          deletedAt: null,
        },
        _count: true,
      }),
    ])

    // 计算唯一员工数量
    const employeeCount = employeeCountResult.length

    return NextResponse.json({
      records,
      total,
      pageSize,
      page,
      stats: {
        totalAmount: totalAmount._sum.totalAmount || 0,
        paidAmount: paidAmount._sum.totalAmount || 0,
        employeeCount,
        paymentRate: totalAmount._sum.totalAmount
          ? ((paidAmount._sum.totalAmount || 0) / totalAmount._sum.totalAmount) *
            100
          : 0,
      },
    })
  } catch (error) {
    console.error("[API] 获取社保记录失败:", error instanceof Error ? error.message : String(error))
    return NextResponse.json(
      { error: "获取社保记录失败" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // 数据验证
    if (!data.enterpriseId) {
      return NextResponse.json(
        { error: "企业ID不能为空" },
        { status: 400 }
      )
    }

    if (!data.employeeName) {
      return NextResponse.json(
        { error: "员工姓名不能为空" },
        { status: 400 }
      )
    }

    if (!data.idNumber) {
      return NextResponse.json(
        { error: "身份证号不能为空" },
        { status: 400 }
      )
    }

    const record = await db.socialRecord.create({
      data: {
        ...data,
        paymentStatus: data.paymentStatus || "未缴纳",
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
    console.error("[API] 创建社保记录失败:", error instanceof Error ? error.message : String(error))
    return NextResponse.json(
      { error: "创建社保记录失败" },
      { status: 500 }
    )
  }
}
