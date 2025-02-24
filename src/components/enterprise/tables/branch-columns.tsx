import { ColumnDef } from "@tanstack/react-table"
import { formatDate } from "@/lib/utils"

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "name",
    header: "分支机构名称",
  },
  {
    accessorKey: "address",
    header: "地址",
  },
  {
    accessorKey: "createdAt",
    header: "创建时间",
    cell: ({ row }) => formatDate(row.getValue("createdAt")),
  },
]
