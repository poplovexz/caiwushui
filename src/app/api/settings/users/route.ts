import { NextResponse } from "next/server"
import { db } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth/config/auth-options"

// 获取用户列表
export async function GET() {
  try {
    // 验证用户是否有权限
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "没有权限访问此资源" },
        { status: 403 }
      )
    }

    // 获取用户列表
    const users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        lastLoginAt: true,
        createdAt: true,
        assignedRole: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error("获取用户列表失败:", error)
    return NextResponse.json(
      { error: "获取用户列表失败" },
      { status: 500 }
    )
  }
}

// 创建新用户
export async function POST(request: Request) {
  try {
    // 验证用户是否有权限
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "没有权限访问此资源" },
        { status: 403 }
      )
    }

    // 获取请求数据
    const data = await request.json()
    
    // 验证必填字段
    if (!data.name || !data.email || !data.password || !data.role) {
      return NextResponse.json(
        { error: "缺少必要字段" },
        { status: 400 }
      )
    }
    
    // 检查邮箱是否已存在
    const existingUser = await db.user.findUnique({
      where: { email: data.email },
    })
    
    if (existingUser) {
      return NextResponse.json(
        { error: "邮箱已被使用" },
        { status: 400 }
      )
    }
    
    // 创建用户
    const user = await db.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password, // 注意：实际应用中应该对密码进行哈希处理
        role: data.role,
        status: data.status || "ACTIVE",
        roleId: data.roleId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
      },
    })
    
    // 记录操作日志
    await db.operationLog.create({
      data: {
        userId: session.user.id,
        action: "CREATE",
        module: "USER",
        description: `创建用户 ${user.name} (${user.email})`,
      },
    })
    
    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error("创建用户失败:", error)
    return NextResponse.json(
      { error: "创建用户失败" },
      { status: 500 }
    )
  }
}
