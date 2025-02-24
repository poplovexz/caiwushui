export interface IEnterprise {
  name: string                 // 企业名称
  unifiedSocialCode: string    // 统一社会信用代码
  registrationDate: Date       // 注册日期
  legalPerson: string         // 法人
  registeredCapital: number   // 注册资本
  paidInCapital?: number      // 实缴资本
  status: string              // 经营状态
  type: string               // 企业类型
  industry: string           // 所属行业
  registrationAuth: string   // 登记机关
  approvalDate: Date         // 核准日期
  district: string           // 所属地区
  address: string            // 企业地址
  businessScope: string      // 经营范围
  employees?: number         // 员工人数
  phone?: string            // 联系电话
  email?: string            // 联系邮箱
  website?: string          // 官网
}

export interface IBranch {
  name: string              // 分支机构名称
  address: string          // 地址
}

export interface IShareholder {
  name: string             // 股东名称
  type: string            // 股东类型
  contribution: number    // 认缴出资额
  ratio: number          // 持股比例
}

export interface IInvestment {
  investedName: string    // 被投资企业名称
  amount: number         // 投资金额
  ratio: number         // 投资比例
}

export interface IChange {
  changeItem: string     // 变更项目
  beforeChange: string   // 变更前
  afterChange: string    // 变更后
  changeDate: Date      // 变更日期
}

export interface IAnnualReport {
  year: number           // 年度
  totalAssets?: number   // 资产总额
  totalEquity?: number   // 所有者权益
  totalRevenue?: number  // 营业总收入
  totalProfit?: number   // 利润总额
  employees?: number     // 员工人数
  reportDate: Date       // 报告日期
}
