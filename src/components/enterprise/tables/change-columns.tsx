import { ColumnDef } from "@tanstack/react-table"
import { formatDate } from "@/lib/utils"

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "changeItem",
    header: "变更项目",
  },
  {
    accessorKey: "beforeChange",
    header: "变更前",
  },
  {
    accessorKey: "afterChange",
    header: "变更后",
  },
  {
    accessorKey: "changeDate",
    header: "变更日期",
    cell: ({ row }) => formatDate(row.getValue("changeDate")),
  },
]
