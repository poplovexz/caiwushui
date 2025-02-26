import { Metadata } from "next"

export const metadata: Metadata = {
  title: "系统设置",
  description: "管理系统配置和用户权限",
}

export default function SettingsPage() {
  return (
    <div className="container py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">系统设置</h1>
      </div>
      <div className="mt-6">
        {/* 系统设置内容将在这里实现 */}
      </div>
    </div>
  )
}
