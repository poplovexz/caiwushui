import { z } from 'zod';

// 企业状态枚举
export enum EnterpriseStatus {
  NORMAL = '在业',
  CANCELLED = '注销',
  REVOKED = '吊销',
  MOVING = '迁出',
}

// 企业类型枚举
export enum EnterpriseType {
  LIMITED = '有限责任公司',
  STOCK = '股份有限公司',
  INDIVIDUAL = '个体工商户',
  PARTNERSHIP = '合伙企业',
  FOREIGN = '外商投资企业',
}

// 数据来源枚举
export enum DataSource {
  MANUAL = 'manual',
  CRAWLER = 'crawler',
}

// 企业信息验证模式
export const enterpriseSchema = z.object({
  name: z.string().min(1, '企业名称不能为空'),
  unifiedSocialCode: z.string().length(18, '统一社会信用代码必须是18位'),
  registrationDate: z.date(),
  legalPerson: z.string().min(1, '法人不能为空'),
  registeredCapital: z.number().positive('注册资本必须大于0'),
  paidInCapital: z.number().positive('实缴资本必须大于0').optional(),
  status: z.nativeEnum(EnterpriseStatus),
  type: z.nativeEnum(EnterpriseType),
  industry: z.string().min(1, '所属行业不能为空'),
  registrationAuth: z.string().min(1, '登记机关不能为空'),
  approvalDate: z.date(),
  district: z.string().min(1, '所属地区不能为空'),
  address: z.string().min(1, '企业地址不能为空'),
  businessScope: z.string(),
  employees: z.number().int().positive('员工人数必须大于0').optional(),
  phone: z.string().optional(),
  email: z.string().email('邮箱格式不正确').optional(),
  website: z.string().url('网址格式不正确').optional(),
});

// 企业信息接口
export type IEnterprise = z.infer<typeof enterpriseSchema>;

// 企业查询参数
export interface IEnterpriseQuery {
  page?: number;
  pageSize?: number;
  keyword?: string;
  status?: EnterpriseStatus;
  type?: EnterpriseType;
  district?: string;
  startDate?: Date;
  endDate?: Date;
  industry?: string;
}
