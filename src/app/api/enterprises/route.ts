import { NextRequest, NextResponse } from 'next/server';
import { EnterpriseService } from '@/services/enterprise.service';
import { enterpriseSchema } from '@/types/enterprise';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth/config/auth-options';
import { logger } from '@/lib/logger';

// 获取企业列表
export async function GET(request: NextRequest) {
  try {
    // 检查认证
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 });
    }

    // 获取查询参数
    const searchParams = request.nextUrl.searchParams;
    const query = {
      page: Number(searchParams.get('page')) || 1,
      pageSize: Number(searchParams.get('pageSize')) || 10,
      keyword: searchParams.get('keyword') || undefined,
      status: searchParams.get('status') || undefined,
      type: searchParams.get('type') || undefined,
      district: searchParams.get('district') || undefined,
      industry: searchParams.get('industry') || undefined,
      startDate: searchParams.get('startDate')
        ? new Date(searchParams.get('startDate')!)
        : undefined,
      endDate: searchParams.get('endDate')
        ? new Date(searchParams.get('endDate')!)
        : undefined,
    };

    const result = await EnterpriseService.getList(query);
    return NextResponse.json(result);
  } catch (error) {
    logger.error('Get enterprises error:', error);
    return NextResponse.json(
      { error: '获取企业列表失败' },
      { status: 500 }
    );
  }
}

// 创建企业
export async function POST(request: NextRequest) {
  try {
    // 检查认证
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 });
    }

    const body = await request.json();

    // 验证数据
    const validatedData = enterpriseSchema.parse(body);

    const enterprise = await EnterpriseService.create(validatedData);
    return NextResponse.json(enterprise, { status: 201 });
  } catch (error) {
    logger.error('Create enterprise error:', error);
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: '数据验证失败', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: '创建企业失败' },
      { status: 500 }
    );
  }
}
