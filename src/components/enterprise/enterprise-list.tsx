"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"
import { Button } from "../ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash } from "lucide-react"
import { formatDate } from "../../lib/utils"
import { EnterpriseStatus } from "../../types/enterprise"
import { useRouter } from "next/navigation"

export function EnterpriseList() {
  const router = useRouter()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const { data, isLoading, error } = useQuery({
    queryKey: ["enterprises", page, pageSize],
    queryFn: async () => {
      const response = await fetch(
        `/api/enterprises?page=${page}&pageSize=${pageSize}`
      )
      if (!response.ok) {
        throw new Error("获取企业列表失败")
      }
      return response.json()
    },
  })

  if (isLoading) {
    return <div>加载中...</div>
  }

  if (error) {
    return <div>加载失败: {error.message}</div>
  }

  const handleEdit = (id: string) => {
    router.push(`/enterprises/${id}/edit`)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除这个企业吗？")) {
      return
    }

    try {
      const response = await fetch(`/api/enterprises/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("删除企业失败")
      }

      // 刷新列表
      router.refresh()
    } catch (error) {
      console.error("删除企业出错:", error)
      alert("删除企业失败")
    }
  }

  const handleView = (id: string) => {
    router.push(`/enterprises/${id}`)
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>企业名称</TableHead>
            <TableHead>统一社会信用代码</TableHead>
            <TableHead>注册资本</TableHead>
            <TableHead>成立日期</TableHead>
            <TableHead>经营状态</TableHead>
            <TableHead className="w-24">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.enterprises.map((enterprise) => (
            <TableRow key={enterprise.id}>
              <TableCell>{enterprise.name}</TableCell>
              <TableCell>{enterprise.unifiedSocialCreditCode}</TableCell>
              <TableCell>{enterprise.registeredCapital}</TableCell>
              <TableCell>
                {formatDate(enterprise.establishmentDate)}
              </TableCell>
              <TableCell>
                <EnterpriseStatus status={enterprise.status} />
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>操作</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() =>
                        router.push(`/dashboard/enterprises/${enterprise.id}`)
                      }
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      查看详情
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(enterprise.id)}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      删除
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between">
        <div>
          共 {data.total} 条记录，每页显示
          <select
            className="mx-2 rounded-md border p-1"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
          条
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            上一页
          </Button>
          <Button
            variant="outline"
            onClick={() => setPage(page + 1)}
            disabled={page * pageSize >= data.total}
          >
            下一页
          </Button>
        </div>
      </div>
    </div>
  )
}
