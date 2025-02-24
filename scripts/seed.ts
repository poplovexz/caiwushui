import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  // 创建管理员账号
  const hashedPassword = await hash("admin", 10)
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "管理员",
      password: hashedPassword,
      role: "ADMIN",
    },
  })

  console.log("管理员账号创建成功:", admin)

  // 生成示例企业数据
  const industries = ["制造业", "服务业", "科技业", "金融业", "建筑业"]
  const districts = ["北京市", "上海市", "广州市", "深圳市", "杭州市"]
  const statuses = ["在业", "存续", "吊销", "注销"]
  const types = ["有限责任公司", "股份有限公司", "个人独资企业", "合伙企业"]

  for (let i = 1; i <= 20; i++) {
    const registrationDate = new Date(
      Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 365 * 5
    )
    const approvalDate = new Date(
      registrationDate.getTime() + Math.random() * 1000 * 60 * 60 * 24 * 30
    )

    const enterprise = await prisma.enterprise.create({
      data: {
        name: `示例企业${i}`,
        unifiedSocialCode: `91110000${String(i).padStart(8, "0")}`,
        registrationDate,
        legalPerson: `法人${i}`,
        registeredCapital: Math.floor(Math.random() * 10000) * 10000,
        paidInCapital: Math.floor(Math.random() * 10000) * 10000,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        type: types[Math.floor(Math.random() * types.length)],
        industry: industries[Math.floor(Math.random() * industries.length)],
        registrationAuth: "市场监督管理局",
        approvalDate,
        district: districts[Math.floor(Math.random() * districts.length)],
        address: `${districts[Math.floor(Math.random() * districts.length)]}示例路${i}号`,
        businessScope: "经营范围包括但不限于：企业管理咨询、技术服务、商务信息咨询等",
        employees: Math.floor(Math.random() * 1000),
        phone: `1380000${String(i).padStart(4, "0")}`,
        email: `company${i}@example.com`,
        website: `http://www.company${i}.com`,

        // 创建分支机构
        branches: {
          create: Array(Math.floor(Math.random() * 3) + 1)
            .fill(null)
            .map((_, j): { name: string; address: string } => ({
              name: `示例企业${i}分公司${j + 1}`,
              address: `分公司地址${j + 1}`,
            })),
        },

        // 创建股东信息
        shareholders: {
          create: Array(Math.floor(Math.random() * 3) + 1)
            .fill(null)
            .map(
              (_, j): {
                name: string
                type: string
                contribution: number
                ratio: number
              } => ({
                name: `股东${j + 1}`,
                type: ["自然人", "企业"][Math.floor(Math.random() * 2)],
                contribution: Math.floor(Math.random() * 1000) * 10000,
                ratio: Math.random(),
              })
            ),
        },

        // 创建对外投资
        investments: {
          create: Array(Math.floor(Math.random() * 3))
            .fill(null)
            .map(
              (_, j): {
                investedName: string
                amount: number
                ratio: number
              } => ({
                investedName: `被投资企业${j + 1}`,
                amount: Math.floor(Math.random() * 1000) * 10000,
                ratio: Math.random(),
              })
            ),
        },

        // 创建变更记录
        changes: {
          create: Array(Math.floor(Math.random() * 5))
            .fill(null)
            .map(
              (): {
                changeItem: string
                beforeChange: string
                afterChange: string
                changeDate: Date
              } => {
                const items = ["法定代表人", "注册资本", "经营范围", "企业地址"]
                const item = items[Math.floor(Math.random() * items.length)]
                return {
                  changeItem: item,
                  beforeChange: `${item}变更前`,
                  afterChange: `${item}变更后`,
                  changeDate: new Date(
                    approvalDate.getTime() +
                      Math.random() * 1000 * 60 * 60 * 24 * 365
                  ),
                }
              }
            ),
        },

        // 创建年报信息
        annualReports: {
          create: Array(Math.floor(Math.random() * 3) + 1)
            .fill(null)
            .map(
              (_, j): {
                year: number
                totalAssets: number
                totalEquity: number
                totalRevenue: number
                totalProfit: number
                employees: number
                reportDate: Date
              } => ({
                year: 2023 - j,
                totalAssets: Math.floor(Math.random() * 10000) * 10000,
                totalEquity: Math.floor(Math.random() * 10000) * 10000,
                totalRevenue: Math.floor(Math.random() * 10000) * 10000,
                totalProfit: Math.floor(Math.random() * 1000) * 10000,
                employees: Math.floor(Math.random() * 1000),
                reportDate: new Date(2023 - j, 5, 30),
              })
            ),
        },
      },
    })

    console.log(`创建企业数据成功: ${enterprise.name}`)
  }

  console.log("示例数据创建完成")
}

main()
  .catch((e) => {
    console.error("示例数据创建失败:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
