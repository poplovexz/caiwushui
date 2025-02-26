import { Metadata } from "next"

export const metadata: Metadata = {
  title: "登录 - 财务管理系统",
  description: "登录到您的账户",
}

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
