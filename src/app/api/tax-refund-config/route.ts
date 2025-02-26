import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const configs = await prisma.taxRefundConfig.findMany({
      orderBy: {
        updatedAt: "desc"
      }
    })
    return NextResponse.json(configs)
  } catch (error) {
    console.error("获取返税配置失败:", error)
    return NextResponse.json(
      { error: "获取返税配置失败" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // 创建或更新各项税费的返税比例配置
    const configNames = [
      { name: "企业所得税", rate: data.companyRate },
      { name: "个人所得税", rate: data.personalRate },
      { name: "土地使用税", rate: data.landRate },
      { name: "房产税", rate: data.propertyRate },
      { name: "其他税费", rate: data.otherRate },
      { name: "总计", rate: data.totalRate }
    ]

    // 使用事务确保所有配置更新的原子性
    await prisma.$transaction(async (tx) => {
      // 先将所有配置设置为非激活
      await tx.taxRefundConfig.updateMany({
        data: {
          isActive: false
        }
      })

      // 创建新的配置
      for (const config of configNames) {
        await tx.taxRefundConfig.create({
          data: {
            name: config.name,
            rate: config.rate,
            isActive: true
          }
        })
      }
    })

    return NextResponse.json({ message: "配置更新成功" })
  } catch (error) {
    console.error("更新返税配置失败:", error)
    return NextResponse.json(
      { error: "更新返税配置失败" },
      { status: 500 }
    )
  }
}
