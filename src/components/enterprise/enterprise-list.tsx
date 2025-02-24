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
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { EnterpriseStatus } from "@/types/enterprise"
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
            <TableHead>法人代表</TableHead>
            <TableHead>注册资本</TableHead>
            <TableHead>成立日期</TableHead>
            <TableHead>经营状态</TableHead>
            <TableHead>所属地区</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.items.map((enterprise) => (
            <TableRow key={enterprise.id}>
              <TableCell className="font-medium">
                {enterprise.name}
              </TableCell>
              <TableCell>{enterprise.unifiedSocialCode}</TableCell>
              <TableCell>{enterprise.legalPerson}</TableCell>
              <TableCell>
                {enterprise.registeredCapital}万元
              </TableCell>
              <TableCell>
                {formatDate(enterprise.registrationDate)}
              </TableCell>
              <TableCell>
                <span
                  className={
                    enterprise.status === EnterpriseStatus.NORMAL
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {enterprise.status}
                </span>
              </TableCell>
              <TableCell>{enterprise.district}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">打开菜单</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>操作</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => handleView(enterprise.id)}
                    >
                      查看详情
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleEdit(enterprise.id)}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      编辑
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(enterprise.id)}
                      className="text-red-600"
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
        <div className="text-sm text-gray-500">
          共 {data?.total} 条记录
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            上一页
          </Button>
          <div className="text-sm">
            第 {page} 页，共 {data?.totalPages} 页
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= (data?.totalPages || 1)}
          >
            下一页
          </Button>
        </div>
      </div>
    </div>
  )
}
