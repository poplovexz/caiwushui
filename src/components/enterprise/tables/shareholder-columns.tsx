import { ColumnDef } from "@tanstack/react-table"
import { formatDate, formatMoney } from "@/lib/utils"

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "name",
    header: "股东名称",
  },
  {
    accessorKey: "type",
    header: "股东类型",
  },
  {
    accessorKey: "contribution",
    header: "认缴出资额",
    cell: ({ row }) => `${formatMoney(row.getValue("contribution"))}万元`,
  },
  {
    accessorKey: "ratio",
    header: "持股比例",
    cell: ({ row }) => `${row.getValue("ratio")}%`,
  },
  {
    accessorKey: "createdAt",
    header: "创建时间",
    cell: ({ row }) => formatDate(row.getValue("createdAt")),
  },
]
