import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  try {
    // 清理现有数据
    await prisma.taxRefund.deleteMany()
    await prisma.taxRecord.deleteMany()
    await prisma.taxRefundConfig.deleteMany()
    await prisma.financialReport.deleteMany()
    await prisma.financeRecord.deleteMany()
    await prisma.socialRecord.deleteMany()
    await prisma.enterprise.deleteMany()
    await prisma.user.deleteMany()

    // 创建测试用户
    const hashedPassword = await hash('123456', 12)
    const user = await prisma.user.create({
      data: {
        name: '管理员',
        email: 'admin@example.com',
        role: 'admin',
        password: hashedPassword
      }
    })
    console.log('创建用户成功:', user.email)

    // 创建企业数据
    const enterprises = await Promise.all([
      prisma.enterprise.create({
        data: {
          name: '阿里巴巴（中国）有限公司',
          unifiedSocialCode: '91330100799655058B',
          legalPerson: '张勇',
          registeredCapital: 1500000000,
          foundingDate: new Date('2010-01-01'),
          businessScope: '互联网服务',
          address: '浙江省杭州市余杭区文一西路969号',
          contactNumber: '0571-88888888',
          email: 'contact@alibaba.com'
        }
      }),
      prisma.enterprise.create({
        data: {
          name: '腾讯科技（深圳）有限公司',
          unifiedSocialCode: '91440300708461136T',
          legalPerson: '马化腾',
          registeredCapital: 1000000000,
          foundingDate: new Date('2011-02-15'),
          businessScope: '互联网服务',
          address: '广东省深圳市南山区高新区科技中一路腾讯大厦',
          contactNumber: '0755-99999999',
          email: 'contact@tencent.com'
        }
      }),
      prisma.enterprise.create({
        data: {
          name: '百度在线网络技术（北京）有限公司',
          unifiedSocialCode: '91110000802100433B',
          legalPerson: '李彦宏',
          registeredCapital: 2000000000,
          foundingDate: new Date('2012-03-20'),
          businessScope: '互联网服务',
          address: '北京市海淀区上地十街10号',
          contactNumber: '010-77777777',
          email: 'contact@baidu.com'
        }
      })
    ])

    // 创建返税配置
    const configs = await Promise.all([
      prisma.taxRefundConfig.create({
        data: {
          name: '企业所得税',
          rate: 45,
          isActive: true
        }
      }),
      prisma.taxRefundConfig.create({
        data: {
          name: '个人所得税',
          rate: 40,
          isActive: true
        }
      }),
      prisma.taxRefundConfig.create({
        data: {
          name: '土地使用税',
          rate: 35,
          isActive: true
        }
      }),
      prisma.taxRefundConfig.create({
        data: {
          name: '房产税',
          rate: 30,
          isActive: true
        }
      }),
      prisma.taxRefundConfig.create({
        data: {
          name: '其他税费',
          rate: 25,
          isActive: true
        }
      }),
      prisma.taxRefundConfig.create({
        data: {
          name: '总计',
          rate: 35,
          isActive: true
        }
      })
    ])

    // 为每个企业创建税收记录
    const taxTypes = ['企业所得税', '个人所得税', '土地使用税', '房产税', '其他税费']
    const currentYear = new Date().getFullYear()
    
    for (const enterprise of enterprises) {
      // 生成已处理的税收记录
      for (let month = 1; month <= 6; month++) {
        for (const taxType of taxTypes) {
          const taxableIncome = Math.floor(Math.random() * 1000000) + 500000
          const taxAmount = Math.floor(taxableIncome * 0.25)
          
          const taxRecord = await prisma.taxRecord.create({
            data: {
              enterpriseId: enterprise.id,
              year: currentYear,
              month,
              taxableIncome,
              taxAmount,
              paidAmount: taxAmount,
              taxType,
              paymentStatus: '已缴纳',
              dueDate: `${currentYear}-${String(month).padStart(2, '0')}-15`,
              paymentDate: `${currentYear}-${String(month).padStart(2, '0')}-10`,
              taxNumber: enterprise.unifiedSocialCode
            }
          })
        }

        // 为每月的税收记录创建返税记录
        const monthRecords = await prisma.taxRecord.findMany({
          where: {
            enterpriseId: enterprise.id,
            year: currentYear,
            month,
            taxRefundId: null
          }
        })

        const totalTaxAmount = monthRecords.reduce((sum, record) => sum + record.taxAmount, 0)
        const totalBaseAmount = monthRecords.reduce((sum, record) => sum + record.taxableIncome, 0)

        const refund = await prisma.taxRefund.create({
          data: {
            enterpriseId: enterprise.id,
            taxNumber: enterprise.unifiedSocialCode,
            taxPeriod: `${currentYear}-${String(month).padStart(2, '0')}`,
            taxAmount: totalTaxAmount,
            baseAmount: totalBaseAmount,
            refundRate: 35,
            refundAmount: totalTaxAmount * 0.35,
            personalAmount: monthRecords.find(r => r.taxType === '个人所得税')?.taxAmount * 0.4 || 0,
            companyAmount: monthRecords.find(r => r.taxType === '企业所得税')?.taxAmount * 0.45 || 0,
            landAmount: monthRecords.find(r => r.taxType === '土地使用税')?.taxAmount * 0.35 || 0,
            propertyAmount: monthRecords.find(r => r.taxType === '房产税')?.taxAmount * 0.3 || 0,
            otherAmount: monthRecords.find(r => r.taxType === '其他税费')?.taxAmount * 0.25 || 0,
            totalAmount: totalTaxAmount * 0.35,
            status: ['未处理', '处理中', '已处理'][Math.floor(Math.random() * 3)]
          }
        })

        // 更新税收记录关联到返税记录
        await prisma.taxRecord.updateMany({
          where: {
            id: {
              in: monthRecords.map(r => r.id)
            }
          },
          data: {
            taxRefundId: refund.id
          }
        })
      }

      // 生成未处理的税收记录（最近一个月）
      for (const taxType of taxTypes) {
        const taxableIncome = Math.floor(Math.random() * 1000000) + 500000
        const taxAmount = Math.floor(taxableIncome * 0.25)
        
        await prisma.taxRecord.create({
          data: {
            enterpriseId: enterprise.id,
            year: currentYear,
            month: 7,
            taxableIncome,
            taxAmount,
            paidAmount: taxAmount,
            taxType,
            paymentStatus: '已缴纳',
            dueDate: `${currentYear}-07-15`,
            paymentDate: `${currentYear}-07-10`,
            taxNumber: enterprise.unifiedSocialCode
          }
        })
      }
    }

    console.log('数据填充完成')
  } catch (error) {
    console.error('数据填充失败:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
