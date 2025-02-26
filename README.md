# 企业财务管理系统

这是一个基于 Next.js 13+ 和 Prisma 开发的现代化企业财务管理系统。系统提供了完整的企业财务管理功能，包括税收管理、退税管理、财务报表等功能。

## 主要功能

- 🔐 用户认证与授权
  - 基于 NextAuth.js 的安全认证系统
  - 基于角色的访问控制
  - JWT 令牌管理

- 📊 财务管理
  - 财务记录管理
  - 财务报表生成
  - 数据可视化展示

- 💰 税收管理
  - 税收记录管理
  - 退税申请处理
  - 退税配置管理
  - 自动计算退税金额

- 🏢 企业管理
  - 企业信息管理
  - 多企业支持
  - 企业用户关联

## 技术栈

- **框架**: Next.js 13+ (App Router)
- **语言**: TypeScript
- **数据库**: PostgreSQL
- **ORM**: Prisma
- **认证**: NextAuth.js
- **UI**: 
  - Tailwind CSS
  - Shadcn UI
  - React Hook Form
  - Zod 验证

## 开始使用

### 环境要求

- Node.js 18+
- PostgreSQL
- pnpm (推荐)

### 安装步骤

1. 克隆仓库
```bash
git clone https://github.com/poplovexz/caiwushui.git
cd caiwushui
```

2. 安装依赖
```bash
pnpm install
```

3. 配置环境变量
```bash
cp .env.example .env
```
然后编辑 .env 文件，填入必要的环境变量：
- DATABASE_URL: PostgreSQL 数据库连接 URL
- NEXTAUTH_SECRET: NextAuth.js 密钥
- NEXTAUTH_URL: 应用访问地址

4. 初始化数据库
```bash
pnpm prisma migrate dev
pnpm prisma generate
```

5. 填充测试数据
```bash
pnpm prisma db seed
```

6. 启动开发服务器
```bash
pnpm dev
```

现在可以访问 http://localhost:3500 查看应用。

### 默认账号

- 邮箱: admin@example.com
- 密码: 123456

## 项目结构

```
src/
├── app/                    # Next.js 13 App Router 路由
├── components/            # React 组件
│   ├── ui/               # UI 基础组件
│   └── ...              # 业务组件
├── lib/                  # 工具函数和库
├── auth/                 # 认证相关配置
└── types/               # TypeScript 类型定义
```

## 部署

1. 构建应用
```bash
pnpm build
```

2. 启动生产服务器
```bash
pnpm start
```

## 开发指南

### 代码风格

- 使用 ESLint 和 Prettier 进行代码格式化
- 遵循 TypeScript 严格模式
- 使用 React Server Components 优化性能

### 提交规范

提交信息格式：
```
<type>: <description>

[optional body]
[optional footer]
```

类型包括：
- feat: 新功能
- fix: 修复
- docs: 文档更新
- style: 代码格式
- refactor: 重构
- test: 测试
- chore: 构建过程或辅助工具的变动

## 许可证

MIT

## 作者

Codeium AI
