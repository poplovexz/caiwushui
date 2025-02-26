"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"

export type SocialSecurityRecord = {
  id: string
  enterprise: {
    name: string
  }
  employeeName: string
  idNumber: string
  insuranceType: string
  baseAmount: number
  personalAmount: number
  companyAmount: number
  totalAmount: number
  paymentStatus: string
  paymentDate: string | null
}

export const columns: ColumnDef<SocialSecurityRecord>[] = [
  {
    accessorKey: "enterprise.name",
    header: "企业名称",
  },
  {
    accessorKey: "employeeName",
    header: "员工姓名",
  },
  {
    accessorKey: "idNumber",
    header: "身份证号",
  },
  {
    accessorKey: "insuranceType",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          保险类型
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "baseAmount",
    header: "基数",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("baseAmount"))
      const formatted = new Intl.NumberFormat("zh-CN", {
        style: "currency",
        currency: "CNY",
      }).format(amount)
      return formatted
    },
  },
  {
    accessorKey: "personalAmount",
    header: "个人缴费",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("personalAmount"))
      const formatted = new Intl.NumberFormat("zh-CN", {
        style: "currency",
        currency: "CNY",
      }).format(amount)
      return formatted
    },
  },
  {
    accessorKey: "companyAmount",
    header: "单位缴费",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("companyAmount"))
      const formatted = new Intl.NumberFormat("zh-CN", {
        style: "currency",
        currency: "CNY",
      }).format(amount)
      return formatted
    },
  },
  {
    accessorKey: "totalAmount",
    header: "总金额",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("totalAmount"))
      const formatted = new Intl.NumberFormat("zh-CN", {
        style: "currency",
        currency: "CNY",
      }).format(amount)
      return formatted
    },
  },
  {
    accessorKey: "paymentStatus",
    header: "缴纳状态",
  },
  {
    accessorKey: "paymentDate",
    header: "缴纳日期",
    cell: ({ row }) => {
      const date = row.getValue("paymentDate")
      if (!date) return "-"
      return new Date(date as string).toLocaleDateString("zh-CN")
    },
  },
]
