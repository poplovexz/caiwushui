import { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "版本管理",
  description: "查看系统版本历史和更新记录",
}

export default function VersionsPage() {
  // 模拟版本历史数据
  const versionHistory = [
    {
      version: "1.0.0",
      releaseDate: "2025-02-15",
      description: "系统初始版本发布",
      changes: [
        "基础功能上线",
        "用户管理模块",
        "企业管理模块",
        "税务记录管理"
      ]
    },
    {
      version: "0.9.0",
      releaseDate: "2025-01-20",
      description: "公测版本",
      changes: [
        "系统架构优化",
        "UI界面改进",
        "修复已知问题"
      ]
    },
    {
      version: "0.8.0",
      releaseDate: "2024-12-10",
      description: "内测版本",
      changes: [
        "核心功能开发",
        "数据库结构设计",
        "基础UI框架搭建"
      ]
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">版本管理</h3>
        <p className="text-sm text-muted-foreground">
          查看系统版本历史和更新记录
        </p>
      </div>
      
      <div className="space-y-4">
        {versionHistory.map((version, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>版本 {version.version}</CardTitle>
                <span className="text-sm text-muted-foreground">
                  发布日期: {version.releaseDate}
                </span>
              </div>
              <CardDescription>{version.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <h4 className="text-sm font-medium mb-2">更新内容:</h4>
              <ul className="list-disc pl-5 space-y-1">
                {version.changes.map((change, changeIndex) => (
                  <li key={changeIndex} className="text-sm">{change}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
