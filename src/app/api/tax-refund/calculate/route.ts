import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { enterpriseId, taxRecords } = data

    // 获取最新的返税配置
    const configs = await prisma.taxRefundConfig.findMany({
      where: {
        isActive: true
      }
    })

    const configMap = configs.reduce((acc, config) => {
      acc[config.name] = Number(config.rate)
      return acc
    }, {} as Record<string, number>)

    // 计算各类税费的返税金额
    let totalTaxAmount = 0
    let totalBaseAmount = 0
    let personalAmount = 0
    let companyAmount = 0
    let landAmount = 0
    let propertyAmount = 0
    let otherAmount = 0

    for (const record of taxRecords) {
      const amount = Number(record.taxAmount)
      totalTaxAmount += amount

      switch (record.taxType) {
        case "个人所得税":
          personalAmount += amount * (configMap["个人所得税"] || 0) / 100
          break
        case "企业所得税":
          companyAmount += amount * (configMap["企业所得税"] || 0) / 100
          break
        case "土地使用税":
          landAmount += amount * (configMap["土地使用税"] || 0) / 100
          break
        case "房产税":
          propertyAmount += amount * (configMap["房产税"] || 0) / 100
          break
        default:
          otherAmount += amount * (configMap["其他税费"] || 0) / 100
      }

      totalBaseAmount += Number(record.taxableIncome)
    }

    // 计算总返税金额
    const totalRefundAmount = personalAmount + companyAmount + landAmount + 
      propertyAmount + otherAmount

    // 创建返税记录
    const taxRefund = await prisma.taxRefund.create({
      data: {
        enterpriseId,
        taxNumber: taxRecords[0].taxNumber,
        taxPeriod: `${taxRecords[0].year}-${String(taxRecords[0].month).padStart(2, '0')}`,
        taxAmount: totalTaxAmount,
        baseAmount: totalBaseAmount,
        refundRate: configMap["总计"] || 0,
        refundAmount: totalRefundAmount,
        personalAmount,
        companyAmount,
        landAmount,
        propertyAmount,
        otherAmount,
        totalAmount: totalRefundAmount,
        status: "未处理"
      }
    })

    return NextResponse.json(taxRefund)
  } catch (error) {
    console.error("计算返税失败:", error)
    return NextResponse.json(
      { error: "计算返税失败" },
      { status: 500 }
    )
  }
}
