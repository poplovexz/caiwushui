import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import { join } from "path"
const { v4: uuidv4 } = require("uuid")

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const enterpriseId = formData.get("enterpriseId") as string

    if (!file || !enterpriseId) {
      return NextResponse.json(
        { error: "文件和企业ID不能为空" },
        { status: 400 }
      )
    }

    // 生成唯一的文件名
    const fileName = file.name
    const fileType = fileName.split(".").pop() || ""
    const uniqueFileName = `${uuidv4()}.${fileType}`

    // 确保上传目录存在
    const uploadDir = join(process.cwd(), "public", "uploads")
    await writeFile(join(uploadDir, uniqueFileName), Buffer.from(await file.arrayBuffer()))

    // 创建版本记录
    const record = await db.versionRecord.create({
      data: {
        enterpriseId,
        fileName,
        fileType,
        fileSize: file.size,
        fileUrl: `/uploads/${uniqueFileName}`,
        version: new Date().toISOString().split("T")[0], // 使用日期作为版本号
        status: "待审核",
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
    console.error("[API] 上传文件失败:", error instanceof Error ? error.message : String(error))
    return NextResponse.json(
      { error: "上传文件失败" },
      { status: 500 }
    )
  }
}
