import { Metadata } from "next"

import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: {
    default: "企业信息管理系统",
    template: "%s | 企业信息管理系统",
  },
  description: "企业信息管理系统",
}

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
    </div>
  )
}
