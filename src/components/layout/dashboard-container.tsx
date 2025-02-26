"use client"

import { SiteHeader } from "@/components/site-header"

interface DashboardContainerProps {
  children: React.ReactNode
}

export function DashboardContainer({ children }: DashboardContainerProps) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
    </div>
  )
}
