import { prisma } from '@/lib/prisma';
import { redis, CACHE_KEYS, CACHE_TTL, getCacheKey } from '@/lib/redis';
import { logger } from '@/lib/logger';
import { IEnterprise, IEnterpriseQuery } from '@/types/enterprise';
import { Prisma } from '@prisma/client';

export class EnterpriseService {
  // 创建企业
  static async create(data: IEnterprise) {
    try {
      const enterprise = await prisma.enterprise.create({
        data: {
          ...data,
          dataSource: 'manual',
        },
      });

      // 清除列表缓存
      await redis.del(CACHE_KEYS.ENTERPRISE_LIST);

      return enterprise;
    } catch (error) {
      logger.error('Create enterprise error:', error);
      throw error;
    }
  }

  // 更新企业
  static async update(id: string, data: Partial<IEnterprise>) {
    try {
      const enterprise = await prisma.enterprise.update({
        where: { id },
        data,
      });

      // 清除相关缓存
      await Promise.all([
        redis.del(getCacheKey(CACHE_KEYS.ENTERPRISE, id)),
        redis.del(CACHE_KEYS.ENTERPRISE_LIST),
      ]);

      return enterprise;
    } catch (error) {
      logger.error('Update enterprise error:', error);
      throw error;
    }
  }

  // 删除企业
  static async delete(id: string) {
    try {
      await prisma.enterprise.delete({
        where: { id },
      });

      // 清除相关缓存
      await Promise.all([
        redis.del(getCacheKey(CACHE_KEYS.ENTERPRISE, id)),
        redis.del(CACHE_KEYS.ENTERPRISE_LIST),
      ]);

      return true;
    } catch (error) {
      logger.error('Delete enterprise error:', error);
      throw error;
    }
  }

  // 获取企业详情
  static async getById(id: string) {
    try {
      // 尝试从缓存获取
      const cacheKey = getCacheKey(CACHE_KEYS.ENTERPRISE, id);
      const cached = await redis.get(cacheKey);
      
      if (cached) {
        return JSON.parse(cached);
      }

      // 从数据库获取
      const enterprise = await prisma.enterprise.findUnique({
        where: { id },
        include: {
          branches: true,
          shareholders: true,
          investments: true,
          changes: true,
          annualReports: true,
        },
      });

      if (!enterprise) {
        return null;
      }

      // 设置缓存
      await redis.setex(
        cacheKey,
        CACHE_TTL.ENTERPRISE,
        JSON.stringify(enterprise)
      );

      return enterprise;
    } catch (error) {
      logger.error('Get enterprise error:', error);
      throw error;
    }
  }

  // 获取企业列表
  static async getList(query: IEnterpriseQuery) {
    try {
      const {
        page = 1,
        pageSize = 10,
        keyword,
        status,
        type,
        district,
        startDate,
        endDate,
        industry,
      } = query;

      // 构建查询条件
      const where: Prisma.EnterpriseWhereInput = {};

      if (keyword) {
        where.OR = [
          { name: { contains: keyword } },
          { unifiedSocialCode: { contains: keyword } },
          { legalPerson: { contains: keyword } },
        ];
      }

      if (status) {
        where.status = status;
      }

      if (type) {
        where.type = type;
      }

      if (district) {
        where.district = district;
      }

      if (industry) {
        where.industry = industry;
      }

      if (startDate && endDate) {
        where.registrationDate = {
          gte: startDate,
          lte: endDate,
        };
      }

      // 计算分页
      const skip = (page - 1) * pageSize;

      // 尝试从缓存获取
      const cacheKey = `${CACHE_KEYS.ENTERPRISE_LIST}:${JSON.stringify({
        where,
        skip,
        pageSize,
      })}`;
      const cached = await redis.get(cacheKey);

      if (cached) {
        return JSON.parse(cached);
      }

      // 从数据库获取
      const [total, items] = await Promise.all([
        prisma.enterprise.count({ where }),
        prisma.enterprise.findMany({
          where,
          skip,
          take: pageSize,
          orderBy: { createdAt: 'desc' },
        }),
      ]);

      const result = {
        total,
        items,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      };

      // 设置缓存
      await redis.setex(
        cacheKey,
        CACHE_TTL.ENTERPRISE_LIST,
        JSON.stringify(result)
      );

      return result;
    } catch (error) {
      logger.error('Get enterprise list error:', error);
      throw error;
    }
  }
}
