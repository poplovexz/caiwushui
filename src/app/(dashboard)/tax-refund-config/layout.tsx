import { Metadata } from "next"

export const metadata: Metadata = {
  title: "返税配置",
  description: "配置企业返税规则和政策",
}

export default function TaxRefundConfigLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
