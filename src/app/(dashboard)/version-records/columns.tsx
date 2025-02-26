"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowDownToLine, Eye, CheckCircle, XCircle } from "lucide-react"
import { formatDate } from "@/lib/utils"

const statusMap = {
  "待审核": { label: "待审核", variant: "default" },
  "已通过": { label: "已通过", variant: "secondary" },
  "已驳回": { label: "已驳回", variant: "destructive" },
}

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "fileName",
    header: "文件名",
    cell: ({ row }) => {
      const record = row.original
      return (
        <div className="flex items-center space-x-2">
          <span>{record.fileName}</span>
          <span className="text-sm text-gray-500">({record.fileType})</span>
        </div>
      )
    },
  },
  {
    accessorKey: "enterprise.name",
    header: "企业名称",
  },
  {
    accessorKey: "version",
    header: "版本号",
  },
  {
    accessorKey: "status",
    header: "状态",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      const { label, variant } = statusMap[status] || statusMap["待审核"]
      return <Badge variant={variant}>{label}</Badge>
    },
  },
  {
    accessorKey: "uploadTime",
    header: "上传时间",
    cell: ({ row }) => formatDate(row.getValue("uploadTime")),
  },
  {
    accessorKey: "reviewTime",
    header: "审核时间",
    cell: ({ row }) => {
      const reviewTime = row.getValue("reviewTime")
      return reviewTime ? formatDate(reviewTime) : "-"
    },
  },
  {
    id: "actions",
    header: "操作",
    cell: ({ row }) => {
      const record = row.original
      const status = record.status

      return (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(record.fileUrl, "_blank")}
          >
            <ArrowDownToLine className="h-4 w-4" />
          </Button>
          
          {status === "待审核" && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="text-green-600"
                onClick={() => handleReview(record.id, "已通过")}
              >
                <CheckCircle className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600"
                onClick={() => handleReview(record.id, "已驳回")}
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      )
    },
  },
]

async function handleReview(id: string, status: string) {
  try {
    const response = await fetch(`/api/version-records/${id}/review`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    })

    if (!response.ok) {
      throw new Error("审核失败")
    }

    // 刷新页面以显示更新后的状态
    window.location.reload()
  } catch (error) {
    console.error("审核失败:", error)
    alert("审核失败，请重试")
  }
}
