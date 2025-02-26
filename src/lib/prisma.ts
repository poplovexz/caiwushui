import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

// 软删除中间件
prisma.$use(async (params, next) => {
  // 检查模型是否有 deletedAt 字段
  const softDeleteModels = ['Enterprise', 'TaxRecord']
  if (!softDeleteModels.includes(params.model || '')) {
    return next(params)
  }

  if (params.action === 'delete') {
    // 将删除操作改为更新 deletedAt 字段
    params.action = 'update'
    params.args.data = { deletedAt: new Date() }
  }

  if (params.action === 'deleteMany') {
    // 将批量删除改为批量更新
    params.action = 'updateMany'
    if (params.args.data !== undefined) {
      params.args.data.deletedAt = new Date()
    } else {
      params.args.data = { deletedAt: new Date() }
    }
  }

  // 自动过滤已删除的记录
  if (params.action === 'findUnique' || params.action === 'findFirst') {
    params.action = 'findFirst'
    params.args.where = { ...params.args.where, deletedAt: null }
  }

  if (params.action === 'findMany') {
    if (params.args?.where) {
      if (params.args.where.deletedAt === undefined) {
        params.args.where.deletedAt = null
      }
    } else {
      params.args = { where: { deletedAt: null } }
    }
  }

  return next(params)
})

export const db = prisma
