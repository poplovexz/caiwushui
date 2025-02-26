"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Eye, Search, Calculator } from "lucide-react"
import { useState, useEffect } from "react"
import { format } from "date-fns"
import { toast } from "sonner"

interface TaxRefund {
  id: string
  taxNumber: string
  taxPeriod: string
  taxAmount: number
  baseAmount: number
  refundRate: number
  refundAmount: number
  personalAmount: number
  companyAmount: number
  landAmount: number
  propertyAmount: number
  otherAmount: number
  totalAmount: number
  status: string
  enterprise: {
    name: string
    unifiedSocialCode: string
  }
}

export default function TaxRefundPage() {
  const [data, setData] = useState<TaxRefund[]>([])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useState({
    startDate: "",
    endDate: "",
    enterpriseName: "",
    status: "all"
  })

  const fetchData = async () => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams()
      if (searchParams.startDate) queryParams.append("startDate", searchParams.startDate)
      if (searchParams.endDate) queryParams.append("endDate", searchParams.endDate)
      if (searchParams.enterpriseName) queryParams.append("enterpriseName", searchParams.enterpriseName)
      if (searchParams.status && searchParams.status !== "all") {
        queryParams.append("status", searchParams.status)
      }

      const response = await fetch(`/api/tax-refund?${queryParams.toString()}`)
      if (!response.ok) throw new Error("获取数据失败")
      
      const refunds = await response.json()
      setData(refunds)
    } catch (error) {
      console.error("获取返税记录失败:", error)
      toast.error("获取返税记录失败")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setSearchParams(prev => ({ ...prev, [field]: value }))
  }

  const handleSearch = () => {
    fetchData()
  }

  const handleCalculate = async () => {
    try {
      // 获取未处理的税收记录
      const response = await fetch("/api/tax-records/unprocessed")
      if (!response.ok) throw new Error("获取税收记录失败")
      
      const taxRecords = await response.json()
      if (!taxRecords.length) {
        toast.info("没有需要计算返税的税收记录")
        return
      }

      // 按企业分组计算返税
      const enterpriseRecords = taxRecords.reduce((acc, record) => {
        if (!acc[record.enterpriseId]) {
          acc[record.enterpriseId] = []
        }
        acc[record.enterpriseId].push(record)
        return acc
      }, {} as Record<string, any[]>)

      // 为每个企业计算返税
      for (const [enterpriseId, records] of Object.entries(enterpriseRecords)) {
        const response = await fetch("/api/tax-refund/calculate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            enterpriseId,
            taxRecords: records
          })
        })

        if (!response.ok) throw new Error("计算返税失败")
      }

      toast.success("返税计算完成")
      fetchData()
    } catch (error) {
      console.error("计算返税失败:", error)
      toast.error("计算返税失败")
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("zh-CN", {
      style: "currency",
      currency: "CNY"
    }).format(amount)
  }

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">返税管理</h1>
        <Button onClick={handleCalculate}>
          <Calculator className="mr-2 h-4 w-4" />
          计算返税
        </Button>
      </div>
      
      <div className="mt-6 grid grid-cols-4 gap-4">
        <div>
          <Input 
            type="date" 
            value={searchParams.startDate}
            onChange={(e) => handleInputChange("startDate", e.target.value)}
          />
        </div>
        <div>
          <Input 
            type="date" 
            value={searchParams.endDate}
            onChange={(e) => handleInputChange("endDate", e.target.value)}
          />
        </div>
        <div>
          <Input 
            placeholder="企业名称" 
            value={searchParams.enterpriseName}
            onChange={(e) => handleInputChange("enterpriseName", e.target.value)}
          />
        </div>
        <div>
          <Select
            value={searchParams.status}
            onValueChange={(value) => handleInputChange("status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="处理状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="未处理">未处理</SelectItem>
                <SelectItem value="处理中">处理中</SelectItem>
                <SelectItem value="已处理">已处理</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-4 flex justify-end">
          <Button onClick={handleSearch}>
            <Search className="mr-2 h-4 w-4" />
            查询
          </Button>
        </div>
      </div>

      <div className="mt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>序号</TableHead>
              <TableHead>企业名称</TableHead>
              <TableHead>税号</TableHead>
              <TableHead>所属期间</TableHead>
              <TableHead>税额</TableHead>
              <TableHead>计税基数</TableHead>
              <TableHead>返税比例</TableHead>
              <TableHead>返税金额</TableHead>
              <TableHead>个人所得税</TableHead>
              <TableHead>企业所得税</TableHead>
              <TableHead>土地使用税</TableHead>
              <TableHead>房产税</TableHead>
              <TableHead>其他税费</TableHead>
              <TableHead>总计</TableHead>
              <TableHead>状态</TableHead>
              <TableHead className="w-[100px]">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={16} className="h-24 text-center">
                  加载中...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={16} className="h-24 text-center">
                  暂无数据
                </TableCell>
              </TableRow>
            ) : (
              data.map((refund, index) => (
                <TableRow key={refund.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{refund.enterprise.name}</TableCell>
                  <TableCell>{refund.taxNumber}</TableCell>
                  <TableCell>{refund.taxPeriod}</TableCell>
                  <TableCell>{formatCurrency(refund.taxAmount)}</TableCell>
                  <TableCell>{formatCurrency(refund.baseAmount)}</TableCell>
                  <TableCell>{refund.refundRate}%</TableCell>
                  <TableCell>{formatCurrency(refund.refundAmount)}</TableCell>
                  <TableCell>{formatCurrency(refund.personalAmount)}</TableCell>
                  <TableCell>{formatCurrency(refund.companyAmount)}</TableCell>
                  <TableCell>{formatCurrency(refund.landAmount)}</TableCell>
                  <TableCell>{formatCurrency(refund.propertyAmount)}</TableCell>
                  <TableCell>{formatCurrency(refund.otherAmount)}</TableCell>
                  <TableCell>{formatCurrency(refund.totalAmount)}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        refund.status === "未处理"
                          ? "bg-yellow-100 text-yellow-800"
                          : refund.status === "处理中"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {refund.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">查看详情</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
