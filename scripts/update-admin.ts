import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await hash("Pop781216", 10)
  const admin = await prisma.user.update({
    where: { email: "admin@example.com" },
    data: {
      password: hashedPassword,
    },
  })

  console.log("管理员密码更新成功:", admin)
}

main()
  .catch((e) => {
    console.error("管理员密码更新失败:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
