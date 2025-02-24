import Link from "next/link"
import { signOut } from "next-auth/react"

import { Button } from "@/components/ui/button"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">企业信息管理系统</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/dashboard/enterprises"
              className="transition-colors hover:text-foreground/80"
            >
              企业管理
            </Link>
            <Link
              href="/dashboard/reports"
              className="transition-colors hover:text-foreground/80"
            >
              年报管理
            </Link>
            <Link
              href="/dashboard/settings"
              className="transition-colors hover:text-foreground/80"
            >
              系统设置
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button
            variant="ghost"
            onClick={() => signOut({ callbackUrl: "/auth/signin" })}
          >
            退出登录
          </Button>
        </div>
      </div>
    </header>
  )
}
