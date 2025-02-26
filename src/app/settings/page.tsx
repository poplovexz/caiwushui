import { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "系统设置",
  description: "管理系统设置和配置",
}

export default function SettingsPage() {
  redirect("/settings/system")
}
