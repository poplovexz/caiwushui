import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import prisma from "@/lib/prisma"
import { authOptions } from "@/lib/auth-options"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const fileType = searchParams.get("fileType")
    const enterpriseName = searchParams.get("enterpriseName")
    const processStatus = searchParams.get("processStatus")

    const where = {
      ...(startDate && {
        uploadTime: {
          gte: new Date(startDate),
        },
      }),
      ...(endDate && {
        uploadTime: {
          lte: new Date(endDate),
        },
      }),
      ...(fileType && fileType !== "all" && {
        fileType,
      }),
      ...(processStatus && processStatus !== "all" && {
        processStatus,
      }),
      ...(enterpriseName && {
        enterprise: {
          name: {
            contains: enterpriseName,
            mode: "insensitive",
          },
        },
      }),
    }

    const files = await prisma.taxPaymentFile.findMany({
      where,
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
    })

    return NextResponse.json(files)
  } catch (error) {
    console.error("Failed to fetch tax payment files:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const enterpriseId = formData.get("enterpriseId") as string

    if (!file || !enterpriseId) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    // TODO: 处理文件上传
    // 1. 保存文件到磁盘
    // 2. 创建数据库记录

    const taxPaymentFile = await prisma.taxPaymentFile.create({
      data: {
        fileName: file.name,
        fileType: file.type,
        processStatus: "pending",
        serialNumber: generateSerialNumber(), // 需要实现此函数
        enterpriseId,
        taxpayerId: "待处理", // 从文件中提取
        totalAmount: 0, // 从文件中提取
        filePath: "待实现", // 文件保存路径
      },
    })

    return NextResponse.json(taxPaymentFile)
  } catch (error) {
    console.error("Failed to upload tax payment file:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

function generateSerialNumber() {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0")
  return `TX${year}${month}${day}${random}`
}
