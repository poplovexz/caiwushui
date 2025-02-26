"use client"

import { ReactNode } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface EnterpriseActionButtonProps {
  href: string
  variant?: "default" | "primary" | "secondary" | "danger"
  size?: "sm" | "md" | "lg"
  children: ReactNode
}

export function EnterpriseActionButton({
  href,
  variant = "primary",
  size = "md",
  children
}: EnterpriseActionButtonProps) {
  return (
    <Link href={href}>
      <Button variant={variant} size={size}>
        {children}
      </Button>
    </Link>
  )
}
