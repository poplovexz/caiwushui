# 企业信息爬虫系统

这是一个用于采集企业信息的爬虫系统。

## 目录结构

```
crawler/
├── src/                    # 源代码目录
│   ├── config/            # 配置文件
│   ├── core/             # 核心爬虫逻辑
│   ├── models/           # 数据模型定义
│   ├── plugins/          # 插件（不同来源的爬虫实现）
│   ├── services/         # 服务层（数据处理、存储等）
│   └── utils/            # 工具函数
├── tests/                # 测试文件
├── docs/                 # 文档
├── .env.example         # 环境变量示例
├── package.json         # 项目配置
└── tsconfig.json        # TypeScript配置
```

## 特性

- 支持多数据源采集
- 并发控制
- 代理支持
- 自动重试
- 数据验证
- 日志记录

## 配置说明

在运行爬虫之前，需要配置以下环境变量：

1. 爬虫配置
   - CRAWLER_INTERVAL: 爬虫运行间隔（秒）
   - CRAWLER_CONCURRENT: 并发爬取数量
   - CRAWLER_TIMEOUT: 请求超时时间（毫秒）
   - CRAWLER_RETRY_TIMES: 重试次数
   - CRAWLER_RETRY_DELAY: 重试延迟（毫秒）

2. 代理配置
   - PROXY_ENABLED: 是否启用代理
   - PROXY_HOST: 代理主机
   - PROXY_PORT: 代理端口
   - PROXY_USERNAME: 代理用户名
   - PROXY_PASSWORD: 代理密码

3. 数据库配置
   - DB_HOST: 数据库主机
   - DB_PORT: 数据库端口
   - DB_NAME: 数据库名
   - DB_USER: 数据库用户
   - DB_PASSWORD: 数据库密码

4. 日志配置
   - LOG_LEVEL: 日志级别
   - LOG_FILE: 日志文件

## 安装

```bash
cd crawler
npm install
```

## 运行

1. 开发环境
```bash
npm run dev
```

2. 生产环境
```bash
npm run build
npm start
```

## 测试

```bash
npm test
```

## 插件开发

要添加新的数据源支持，需要在 `plugins` 目录下创建新的爬虫实现：

1. 创建新的插件类
2. 实现必要的接口方法
3. 在配置中启用新插件

## 注意事项

1. 遵守目标网站的robots.txt规则
2. 合理控制爬取频率
3. 定期维护代理池
4. 及时处理异常情况
5. 注意数据安全性
