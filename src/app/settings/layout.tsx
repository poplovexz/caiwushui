import { Metadata } from "next"
import { SidebarNav } from "@/components/settings/sidebar-nav"

export const metadata: Metadata = {
  title: "系统设置",
  description: "系统设置和管理界面",
}

const sidebarNavItems = [
  {
    title: "用户管理",
    href: "/settings/users",
    icon: "users",
  },
  {
    title: "角色权限",
    href: "/settings/roles",
    icon: "shield",
  },
  {
    title: "版本管理",
    href: "/settings/versions",
    icon: "git-branch",
  },
  {
    title: "系统配置",
    href: "/settings/system",
    icon: "settings",
  },
  {
    title: "企业管理",
    href: "/settings/enterprises",
    icon: "building",
  },
  {
    title: "操作日志",
    href: "/settings/logs",
    icon: "scroll",
  },
]

interface SettingsLayoutProps {
  children: React.ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr] py-6">
      <aside className="hidden w-[200px] flex-col md:flex">
        <SidebarNav items={sidebarNavItems} />
      </aside>
      <main className="flex w-full flex-1 flex-col overflow-hidden">
        {children}
      </main>
    </div>
  )
}
