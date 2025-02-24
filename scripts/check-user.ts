import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: "admin@example.com" },
  })

  console.log("用户数据:", user)
}

main()
  .catch((e) => {
    console.error("查询失败:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
