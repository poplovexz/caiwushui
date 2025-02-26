import { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export const metadata: Metadata = {
  title: "操作日志",
  description: "查看系统操作日志记录",
}

export default function LogsPage() {
  // 模拟日志数据
  const logs = [
    {
      id: 1,
      user: "admin",
      action: "登录系统",
      ip: "192.168.1.100",
      timestamp: "2025-02-26 22:45:12",
      status: "成功"
    },
    {
      id: 2,
      user: "admin",
      action: "新增企业",
      ip: "192.168.1.100",
      timestamp: "2025-02-26 22:50:35",
      status: "成功"
    },
    {
      id: 3,
      user: "operator1",
      action: "修改企业信息",
      ip: "192.168.1.101",
      timestamp: "2025-02-26 23:05:18",
      status: "成功"
    },
    {
      id: 4,
      user: "operator2",
      action: "删除企业",
      ip: "192.168.1.102",
      timestamp: "2025-02-26 23:10:45",
      status: "失败"
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">操作日志</h3>
        <p className="text-sm text-muted-foreground">
          查看系统操作日志记录
        </p>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="flex-1">
          <Input placeholder="搜索日志内容..." />
        </div>
        <Button>
          <Search className="h-4 w-4 mr-2" />
          搜索
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>系统操作日志</CardTitle>
          <CardDescription>
            显示最近的系统操作记录
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-2 text-left font-medium">ID</th>
                  <th className="p-2 text-left font-medium">用户</th>
                  <th className="p-2 text-left font-medium">操作</th>
                  <th className="p-2 text-left font-medium">IP地址</th>
                  <th className="p-2 text-left font-medium">时间</th>
                  <th className="p-2 text-left font-medium">状态</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b">
                    <td className="p-2">{log.id}</td>
                    <td className="p-2">{log.user}</td>
                    <td className="p-2">{log.action}</td>
                    <td className="p-2">{log.ip}</td>
                    <td className="p-2">{log.timestamp}</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        log.status === "成功" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
