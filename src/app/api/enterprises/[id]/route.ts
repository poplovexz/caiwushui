import { NextRequest, NextResponse } from 'next/server';
import { EnterpriseService } from '@/services/enterprise.service';
import { enterpriseSchema } from '@/types/enterprise';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth/config/auth-options';
import { logger } from '@/lib/logger';

// 获取企业详情
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 检查认证
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 });
    }

    const enterprise = await EnterpriseService.getById(params.id);
    if (!enterprise) {
      return NextResponse.json(
        { error: '企业不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json(enterprise);
  } catch (error) {
    logger.error('Get enterprise error:', error);
    return NextResponse.json(
      { error: '获取企业详情失败' },
      { status: 500 }
    );
  }
}

// 更新企业
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 检查认证
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 });
    }

    const body = await request.json();

    // 验证数据
    const validatedData = enterpriseSchema.partial().parse(body);

    const enterprise = await EnterpriseService.update(
      params.id,
      validatedData
    );
    return NextResponse.json(enterprise);
  } catch (error) {
    logger.error('Update enterprise error:', error);
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: '数据验证失败', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: '更新企业失败' },
      { status: 500 }
    );
  }
}

// 删除企业
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 检查认证
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 });
    }

    await EnterpriseService.delete(params.id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    logger.error('Delete enterprise error:', error);
    return NextResponse.json(
      { error: '删除企业失败' },
      { status: 500 }
    );
  }
}
