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
import { Eye, Search } from "lucide-react"
import { useState, useEffect } from "react"
import { format } from "date-fns"
import { toast } from "sonner"

interface FinancialReport {
  id: string
  fileName: string
  reportType: string
  year: string
  quarter: string
  period: string
  totalAssets: number
  totalLiability: number
  netAssets: number
  revenue: number
  profit: number
  uploadTime: string
  processStatus: string
  processType: string
  remarks?: string
  enterprise: {
    name: string
    unifiedSocialCode: string
  }
}

export default function FinancialReportsPage() {
  const [data, setData] = useState<FinancialReport[]>([])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useState({
    startDate: "",
    endDate: "",
    enterpriseName: "",
    processStatus: "all",
    reportType: "all"
  })

  const fetchData = async () => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams()
      if (searchParams.startDate) queryParams.append("startDate", searchParams.startDate)
      if (searchParams.endDate) queryParams.append("endDate", searchParams.endDate)
      if (searchParams.enterpriseName) queryParams.append("enterpriseName", searchParams.enterpriseName)
      if (searchParams.processStatus && searchParams.processStatus !== "all") {
        queryParams.append("processStatus", searchParams.processStatus)
      }
      if (searchParams.reportType && searchParams.reportType !== "all") {
        queryParams.append("reportType", searchParams.reportType)
      }

      const response = await fetch(`/api/financial-reports?${queryParams.toString()}`)
      if (!response.ok) throw new Error("获取数据失败")
      
      const reports = await response.json()
      setData(reports)
    } catch (error) {
      console.error("获取财报记录失败:", error)
      toast.error("获取财报记录失败")
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("zh-CN", {
      style: "currency",
      currency: "CNY"
    }).format(amount)
  }

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">财报信息</h1>
      </div>
      
      <div className="mt-6 grid grid-cols-5 gap-4">
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
            value={searchParams.processStatus}
            onValueChange={(value) => handleInputChange("processStatus", value)}
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
        <div>
          <Select
            value={searchParams.reportType}
            onValueChange={(value) => handleInputChange("reportType", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="报表类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">全部类型</SelectItem>
                <SelectItem value="资产负债表">资产负债表</SelectItem>
                <SelectItem value="利润表">利润表</SelectItem>
                <SelectItem value="现金流量表">现金流量表</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-5 flex justify-end">
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
              <TableHead>文件名称</TableHead>
              <TableHead>报表类型</TableHead>
              <TableHead>企业名称</TableHead>
              <TableHead>总资产</TableHead>
              <TableHead>总负债</TableHead>
              <TableHead>净资产</TableHead>
              <TableHead>营业收入</TableHead>
              <TableHead>净利润</TableHead>
              <TableHead>上传时间</TableHead>
              <TableHead>处理状态</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={12} className="h-24 text-center">
                  加载中...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={12} className="h-24 text-center">
                  暂无数据
                </TableCell>
              </TableRow>
            ) : (
              data.map((report, index) => (
                <TableRow key={report.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{report.fileName}</TableCell>
                  <TableCell>{report.reportType}</TableCell>
                  <TableCell>{report.enterprise.name}</TableCell>
                  <TableCell>{formatCurrency(report.totalAssets)}</TableCell>
                  <TableCell>{formatCurrency(report.totalLiability)}</TableCell>
                  <TableCell>{formatCurrency(report.netAssets)}</TableCell>
                  <TableCell>{formatCurrency(report.revenue)}</TableCell>
                  <TableCell>{formatCurrency(report.profit)}</TableCell>
                  <TableCell>
                    {format(new Date(report.uploadTime), "yyyy-MM-dd HH:mm")}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        report.processStatus === "未处理"
                          ? "bg-yellow-100 text-yellow-800"
                          : report.processStatus === "处理中"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {report.processStatus}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">查看文件</span>
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
