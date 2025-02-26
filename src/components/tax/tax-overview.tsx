"use client"

import { useRouter } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

interface Enterprise {
  id: string
  name: string
  unifiedSocialCode: string
}

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
  enterprise: Enterprise
}

interface Statistics {
  totalTaxAmount: number
  totalPaidAmount: number
  unpaidCount: number
  partiallyPaidCount: number
  fullyPaidCount: number
}

interface TaxOverviewProps {
  records: TaxRecord[]
  unpaidEnterprises: Enterprise[]
  statistics: Statistics
}

export function TaxOverview({ records, unpaidEnterprises, statistics }: TaxOverviewProps) {
  const router = useRouter()

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
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总应纳税额</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatMoney(statistics.totalTaxAmount)}</div>
            <p className="text-xs text-muted-foreground">
              实缴金额：{formatMoney(statistics.totalPaidAmount)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">未缴纳企业</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{statistics.unpaidCount}</div>
            <p className="text-xs text-muted-foreground">
              需要跟进处理
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">部分缴纳企业</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">{statistics.partiallyPaidCount}</div>
            <p className="text-xs text-muted-foreground">
              需要继续跟进
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">已缴纳企业</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{statistics.fullyPaidCount}</div>
            <p className="text-xs text-muted-foreground">
              已完成缴纳
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>本月未缴纳企业</CardTitle>
          <CardDescription>
            以下企业在本月还未提交税收记录，需要及时跟进。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>企业名称</TableHead>
                <TableHead>统一社会信用代码</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {unpaidEnterprises.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    暂无未缴纳企业
                  </TableCell>
                </TableRow>
              ) : (
                unpaidEnterprises.map((enterprise) => (
                  <TableRow key={enterprise.id}>
                    <TableCell className="font-medium">{enterprise.name}</TableCell>
                    <TableCell>{enterprise.unifiedSocialCode}</TableCell>
                    <TableCell className="text-right">
                      <Link href={`/enterprises/${enterprise.id}/tax-records/new`}>
                        <Button size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          添加记录
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>最近税收记录</CardTitle>
          <CardDescription>
            显示本月和上月的税收记录。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>企业名称</TableHead>
                <TableHead>年月</TableHead>
                <TableHead>税种</TableHead>
                <TableHead className="text-right">应纳税额</TableHead>
                <TableHead className="text-right">实缴税额</TableHead>
                <TableHead>缴纳状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    暂无记录
                  </TableCell>
                </TableRow>
              ) : (
                records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.enterprise.name}</TableCell>
                    <TableCell>{record.year}年{record.month}月</TableCell>
                    <TableCell>{record.taxType}</TableCell>
                    <TableCell className="text-right font-mono">
                      {formatMoney(record.taxAmount)}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatMoney(record.paidAmount)}
                    </TableCell>
                    <TableCell className={getStatusColor(record.paymentStatus)}>
                      {record.paymentStatus}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/enterprises/${record.enterprise.id}/tax-records/${record.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          查看
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
