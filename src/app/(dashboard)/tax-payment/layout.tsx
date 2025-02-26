import { Metadata } from "next"

export const metadata: Metadata = {
  title: "完税信息",
  description: "查看和管理企业完税信息",
}

export default function TaxPaymentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
