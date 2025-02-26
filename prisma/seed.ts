const { PrismaClient } = require("@prisma/client")
const { faker } = require("@faker-js/faker/locale/zh_CN")

const prisma = new PrismaClient()

async function main() {
  // 清除现有数据
  await prisma.socialRecord.deleteMany()
  await prisma.taxRecord.deleteMany()
  await prisma.enterprise.deleteMany()
  await prisma.user.deleteMany()

  // 创建管理员用户
  await prisma.user.create({
    data: {
      email: "admin@example.com",
      name: "管理员",
      role: "admin",
    },
  })

  // 生成20条企业数据
  const enterprises = Array.from({ length: 20 }).map(() => ({
    name: faker.company.name(),
    unifiedSocialCode: faker.string.numeric(18),
    legalPerson: faker.person.fullName(),
    registeredCapital: faker.number.int({ min: 100000, max: 10000000 }),
    foundingDate: faker.date.past({ years: 30 }).toISOString(),
    businessScope: faker.company.catchPhrase(),
    address: faker.location.streetAddress(),
    contactNumber: faker.phone.number(),
    email: faker.internet.email(),
  }))

  // 批量插入企业数据
  const createdEnterprises = await prisma.enterprise.createMany({
    data: enterprises,
  })

  // 获取所有企业
  const allEnterprises = await prisma.enterprise.findMany()

  // 为每个企业生成税收记录
  const taxRecords = allEnterprises.flatMap((enterprise) => {
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth() + 1
    
    // 为每个企业生成最近3个月的记录
    return Array.from({ length: 3 }).map((_, index) => {
      const month = currentMonth - index
      const year = month <= 0 ? currentYear - 1 : currentYear
      const adjustedMonth = month <= 0 ? month + 12 : month

      const taxableIncome = faker.number.int({ min: 50000, max: 1000000 })
      const taxAmount = taxableIncome * 0.25 // 假设25%的税率
      const paidAmount = faker.helpers.arrayElement([
        0, // 未缴纳
        taxAmount * 0.5, // 部分缴纳
        taxAmount, // 已缴纳
      ])

      const paymentStatus = paidAmount === 0 
        ? "未缴纳" 
        : paidAmount === taxAmount 
          ? "已缴纳" 
          : "部分缴纳"

      return {
        enterpriseId: enterprise.id,
        year: year,
        month: adjustedMonth,
        taxableIncome: taxableIncome,
        taxAmount: taxAmount,
        paidAmount: paidAmount,
        taxType: faker.helpers.arrayElement([
          "增值税",
          "企业所得税",
          "个人所得税",
          "城市维护建设税",
        ]),
        paymentStatus: paymentStatus,
        dueDate: faker.date.future({ years: 1 }).toISOString(),
        paymentDate: paymentStatus !== "未缴纳" 
          ? faker.date.recent({ days: 30 }).toISOString()
          : null,
        remarks: faker.helpers.arrayElement([
          null,
          "已申请延期",
          "分期缴纳",
          "特殊政策减免",
        ]),
      }
    })
  })

  // 批量插入税收记录
  await prisma.taxRecord.createMany({
    data: taxRecords,
  })

  // 为每个企业生成社保记录
  const socialRecords = allEnterprises.flatMap((enterprise) => {
    // 为每个企业生成1-5条员工社保记录
    const employeeCount = faker.number.int({ min: 1, max: 5 })
    return Array.from({ length: employeeCount }).map(() => {
      const baseAmount = faker.number.int({ min: 3000, max: 20000 })
      const personalRate = 0.105 // 个人缴费比例 10.5%
      const companyRate = 0.285  // 企业缴费比例 28.5%
      const personalAmount = baseAmount * personalRate
      const companyAmount = baseAmount * companyRate
      const totalAmount = personalAmount + companyAmount

      const paymentStatus = faker.helpers.arrayElement([
        "未缴纳",
        "已缴纳",
        "部分缴纳",
      ])

      return {
        enterpriseId: enterprise.id,
        employeeName: faker.person.fullName(),
        idNumber: faker.string.numeric(18),
        insuranceType: faker.helpers.arrayElement([
          "养老保险",
          "医疗保险",
          "失业保险",
          "工伤保险",
          "生育保险",
        ]),
        baseAmount: baseAmount,
        personalAmount: personalAmount,
        companyAmount: companyAmount,
        totalAmount: totalAmount,
        paymentStatus: paymentStatus,
        paymentDate: paymentStatus !== "未缴纳" 
          ? faker.date.recent({ days: 30 }).toISOString()
          : null,
      }
    })
  })

  // 批量插入社保记录
  await prisma.socialRecord.createMany({
    data: socialRecords,
  })

  console.log(`已成功生成：
- ${enterprises.length}条企业数据
- ${taxRecords.length}条税收记录
- ${socialRecords.length}条社保记录`)
}

main()
  .catch((e) => {
    console.error("数据生成失败:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
