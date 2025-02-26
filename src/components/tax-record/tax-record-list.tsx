"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Edit2, Trash2 } from "lucide-react"
import { toast } from "sonner"

interface TaxRecord {
  id: string
  year: number
  month: number
  taxableIncome: number
  taxAmount: number
  paidAmount: number
  taxType: string
  paymentStatus: string
  dueDate: string
  paymentDate: string | null
  remarks: string | null
}

interface TaxRecordListProps {
  enterpriseId: string
  initialRecords: TaxRecord[]
}

export function TaxRecordList({ enterpriseId, initialRecords }: TaxRecordListProps) {
  const router = useRouter()
  const [records, setRecords] = useState(initialRecords)
  const [loading, setLoading] = useState(false)

  const handleEdit = (id: string) => {
    router.push(`/enterprises/${enterpriseId}/tax-records/${id}/edit`)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除这条记录吗？")) {
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`/api/enterprises/${enterpriseId}/tax-records/${id}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("删除记录失败")
      }

      setRecords(records.filter((record) => record.id !== id))
      toast.success("记录已删除")
    } catch (err) {
      console.error("删除记录失败:", err)
      toast.error("删除记录失败")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleDateString("zh-CN")
  }

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("zh-CN", {
      style: "currency",
      currency: "CNY",
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "未缴纳":
        return "text-red-500"
      case "部分缴纳":
        return "text-yellow-500"
      case "已缴纳":
        return "text-green-500"
      default:
        return ""
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>年度</TableHead>
            <TableHead>月份</TableHead>
            <TableHead>税种</TableHead>
            <TableHead className="text-right">应纳税所得额</TableHead>
            <TableHead className="text-right">应纳税额</TableHead>
            <TableHead className="text-right">实缴税额</TableHead>
            <TableHead>缴纳状态</TableHead>
            <TableHead>应缴日期</TableHead>
            <TableHead>实际缴纳日期</TableHead>
            <TableHead>备注</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.length === 0 ? (
            <TableRow>
              <TableCell colSpan={11} className="text-center">
                暂无记录
              </TableCell>
            </TableRow>
          ) : (
            records.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.year}</TableCell>
                <TableCell>{record.month}</TableCell>
                <TableCell>{record.taxType}</TableCell>
                <TableCell className="text-right font-mono">
                  {formatMoney(record.taxableIncome)}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {formatMoney(record.taxAmount)}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {formatMoney(record.paidAmount)}
                </TableCell>
                <TableCell className={getStatusColor(record.paymentStatus)}>
                  {record.paymentStatus}
                </TableCell>
                <TableCell>{formatDate(record.dueDate)}</TableCell>
                <TableCell>{formatDate(record.paymentDate)}</TableCell>
                <TableCell>{record.remarks || "-"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(record.id)}
                      disabled={loading}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(record.id)}
                      disabled={loading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
