import { ColumnDef } from "@tanstack/react-table"
import { formatDate, formatMoney } from "@/lib/utils"

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "investedName",
    header: "被投资企业",
  },
  {
    accessorKey: "amount",
    header: "投资金额",
    cell: ({ row }) => `${formatMoney(row.getValue("amount"))}万元`,
  },
  {
    accessorKey: "ratio",
    header: "投资比例",
    cell: ({ row }) => `${row.getValue("ratio")}%`,
  },
  {
    accessorKey: "createdAt",
    header: "创建时间",
    cell: ({ row }) => formatDate(row.getValue("createdAt")),
  },
]
