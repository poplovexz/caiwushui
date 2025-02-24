import * as z from "zod"

export const userAuthSchema = z.object({
  email: z.string().email({
    message: "请输入有效的邮箱地址",
  }),
  password: z.string().min(8, {
    message: "密码至少需要8个字符",
  }),
})
