import { compare } from "bcryptjs"

async function main() {
  const hashedPassword = "$2a$10$QQ31c6pHXuovpvpiLuNEpu43o6rW2S/LOmN6h6Te9Aq1RvtGoP0kS"
  const password = "Pop781216"

  const isValid = await compare(password, hashedPassword)
  console.log("密码是否正确:", isValid)
}

main().catch(console.error)
