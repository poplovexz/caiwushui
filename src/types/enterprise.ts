import { z } from "zod"

export enum EnterpriseStatus {
  NORMAL = "在业",
  CANCELLED = "注销",
  REVOKED = "吊销",
  MOVING = "迁出",
}

export enum EnterpriseType {
  LIMITED = "有限责任公司",
  STOCK = "股份有限公司",
  INDIVIDUAL = "个体工商户",
  PARTNERSHIP = "合伙企业",
  FOREIGN = "外商投资企业",
}

export enum TaxpayerType {
  GENERAL = "一般纳税人",
  SMALL_SCALE = "小规模纳税人",
}

export const enterpriseSchema = z.object({
  name: z.string().min(1, "企业名称不能为空"),
  unifiedSocialCode: z.string().length(18, "统一社会信用代码必须是18位"),
  legalPerson: z.string().min(1, "法人代表不能为空"),
  registeredCapital: z.number().min(0, "注册资本不能为负数"),
  paidInCapital: z.number().min(0, "实缴资本不能为负数").optional(),
  status: z.nativeEnum(EnterpriseStatus),
  establishmentDate: z.date(),
  registrationAuthority: z.string(),
  approvalDate: z.date(),
  businessScope: z.string(),
  type: z.nativeEnum(EnterpriseType),
  industry: z.string(),
  district: z.string(),
  address: z.string(),
  contactPhone: z.string().optional(),
  email: z.string().email("请输入有效的邮箱地址").optional(),
  website: z.string().url("请输入有效的网址").optional(),
  taxpayerType: z.nativeEnum(TaxpayerType).optional(),
  taxationAuthority: z.string().optional(),
  socialSecurityNo: z.string().optional(),
  employeeCount: z.number().min(0, "参保人数不能为负数").optional(),
})

export type Enterprise = z.infer<typeof enterpriseSchema>
