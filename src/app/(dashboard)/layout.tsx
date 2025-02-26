import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"

import { DashboardContainer } from "@/components/layout/dashboard-container"
import { authOptions } from "@/lib/auth-options"

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

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/(auth)/signin")
  }

  return <DashboardContainer>{children}</DashboardContainer>
}
