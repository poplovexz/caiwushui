"use client"

import { Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

interface TaxPaymentFile {
  id: string
  fileName: string
  fileType: string
  processStatus: string
  processTime: string | null
  serialNumber: string
  enterpriseId: string
  enterpriseName: string
  taxpayerId: string
  totalAmount: number
  uploadTime: string
  filePath: string
}

interface TaxPaymentTableProps {
  data: TaxPaymentFile[]
  onView: (id: string) => void
}

export function TaxPaymentTable({ data, onView }: TaxPaymentTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>序号</TableHead>
            <TableHead>文件名称</TableHead>
            <TableHead>企业名称</TableHead>
            <TableHead>纳税人识别号</TableHead>
            <TableHead>文件类型</TableHead>
            <TableHead>处理状态</TableHead>
            <TableHead>合计金额</TableHead>
            <TableHead>上传时间</TableHead>
            <TableHead className="w-[100px]">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((file, index) => (
            <TableRow key={file.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{file.fileName}</TableCell>
              <TableCell>{file.enterpriseName}</TableCell>
              <TableCell>{file.taxpayerId}</TableCell>
              <TableCell>{file.fileType}</TableCell>
              <TableCell>
                <div className={cn(
                  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                  file.processStatus === "未处理" && "bg-yellow-100 text-yellow-800",
                  file.processStatus === "处理中" && "bg-blue-100 text-blue-800",
                  file.processStatus === "已处理" && "bg-green-100 text-green-800"
                )}>
                  {file.processStatus}
                </div>
              </TableCell>
              <TableCell>{file.totalAmount.toLocaleString('zh-CN', { style: 'currency', currency: 'CNY' })}</TableCell>
              <TableCell>{new Date(file.uploadTime).toLocaleString('zh-CN', { dateStyle: 'short', timeStyle: 'short' })}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onView(file.id)}
                >
                  <Eye className="h-4 w-4" />
                  <span className="sr-only">查看文件</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {data.length === 0 && (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center">
                暂无数据
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
