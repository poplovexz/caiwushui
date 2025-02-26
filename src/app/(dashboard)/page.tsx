import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"

import { authOptions } from "../../auth/auth-options"

export const metadata: Metadata = {
  title: "仪表板",
  description: "企业信息管理系统仪表板",
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/(auth)/signin")
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">欢迎回来，{session.user?.name}</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border bg-card p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium">总企业数</h3>
            </div>
            <div className="text-2xl font-bold">20</div>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium">在业企业</h3>
            </div>
            <div className="text-2xl font-bold">15</div>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium">本月新增</h3>
            </div>
            <div className="text-2xl font-bold">5</div>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium">待审核</h3>
            </div>
            <div className="text-2xl font-bold">2</div>
          </div>
        </div>
      </div>
    </div>
  )
}
