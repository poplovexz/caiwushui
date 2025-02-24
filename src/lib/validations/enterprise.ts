import * as z from "zod"

export const enterpriseSchema = z.object({
  name: z.string().min(1, "企业名称不能为空"),
  unifiedSocialCreditCode: z
    .string()
    .min(18, "统一社会信用代码必须是18位")
    .max(18, "统一社会信用代码必须是18位"),
  registeredCapital: z.string().min(1, "注册资本不能为空"),
  establishmentDate: z.string().min(1, "成立日期不能为空"),
})
