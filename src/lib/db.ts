import { PrismaClient } from "@prisma/client"

// 防止开发环境下创建多个 PrismaClient 实例
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// 创建 PrismaClient 实例
const createPrismaClient = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" 
      ? ["error", "warn", "query"] 
      : ["error"],
  }).$extends({
    result: {
      // 为所有模型添加格式化方法
      // 这样可以在返回给前端前处理敏感数据
      enterprise: {
        formattedFoundingDate: {
          needs: { foundingDate: true },
          compute(enterprise) {
            return enterprise.foundingDate
              ? new Date(enterprise.foundingDate).toLocaleDateString("zh-CN")
              : null
          },
        },
      },
      taxRecord: {
        formattedDueDate: {
          needs: { dueDate: true },
          compute(record) {
            return record.dueDate
              ? new Date(record.dueDate).toLocaleDateString("zh-CN")
              : null
          },
        },
        formattedPaymentDate: {
          needs: { paymentDate: true },
          compute(record) {
            return record.paymentDate
              ? new Date(record.paymentDate).toLocaleDateString("zh-CN")
              : null
          },
        },
      },
      socialRecord: {
        formattedPaymentDate: {
          needs: { paymentDate: true },
          compute(record) {
            return record.paymentDate
              ? new Date(record.paymentDate).toLocaleDateString("zh-CN")
              : null
          },
        },
      },
    },
  })
}

// 在开发环境下复用 PrismaClient 实例
export const db = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db
}

// 优雅关闭数据库连接
process.on("beforeExit", async () => {
  await db.$disconnect()
})
