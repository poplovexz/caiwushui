import { ColumnDef } from "@tanstack/react-table"
import { formatDate, formatMoney } from "@/lib/utils"

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "year",
    header: "年度",
  },
  {
    accessorKey: "totalAssets",
    header: "资产总额",
    cell: ({ row }) => {
      const value = row.getValue("totalAssets")
      return value ? `${formatMoney(value)}万元` : "-"
    },
  },
  {
    accessorKey: "totalEquity",
    header: "所有者权益",
    cell: ({ row }) => {
      const value = row.getValue("totalEquity")
      return value ? `${formatMoney(value)}万元` : "-"
    },
  },
  {
    accessorKey: "totalRevenue",
    header: "营业总收入",
    cell: ({ row }) => {
      const value = row.getValue("totalRevenue")
      return value ? `${formatMoney(value)}万元` : "-"
    },
  },
  {
    accessorKey: "totalProfit",
    header: "利润总额",
    cell: ({ row }) => {
      const value = row.getValue("totalProfit")
      return value ? `${formatMoney(value)}万元` : "-"
    },
  },
  {
    accessorKey: "employees",
    header: "员工人数",
    cell: ({ row }) => {
      const value = row.getValue("employees")
      return value ? `${value}人` : "-"
    },
  },
  {
    accessorKey: "reportDate",
    header: "报告日期",
    cell: ({ row }) => formatDate(row.getValue("reportDate")),
  },
]
