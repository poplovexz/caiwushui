# 财务税收管理系统

基于 Next.js 15 和 TypeScript 构建的现代化财务税收管理系统。

## 技术栈

- **前端框架**: Next.js 15
- **编程语言**: TypeScript
- **UI 组件**: Shadcn UI
- **样式方案**: Tailwind CSS
- **数据库**: Prisma + PostgreSQL
- **认证**: NextAuth.js
- **状态管理**: React Query

## 功能特性

- [x] 用户认证系统
- [ ] 财务管理
- [ ] 税收计算
- [ ] 报表生成
- [ ] 数据分析

## 开发环境设置

1. 克隆仓库
```bash
git clone https://github.com/poplovexz/caiwushui.git
cd caiwushui
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量
```bash
cp .env.example .env
# 编辑 .env 文件，填入必要的配置
```

4. 运行开发服务器
```bash
npm run dev
```

## 项目结构

```
src/
├── app/                    # Next.js 应用路由
├── auth/                   # 认证相关逻辑
├── components/            # React 组件
├── styles/               # 样式文件
└── lib/                  # 工具函数和配置
```

## 贡献指南

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的改动 (`git commit -m '添加一些特性'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 许可证

[MIT](LICENSE)
