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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Search } from "lucide-react"
import { useState, useEffect } from "react"
import { format } from "date-fns"
import { toast } from "sonner"

interface FinanceRecord {
  id: string
  fileName: string
  taxNumber: number
  year: string
  period: string
  taxpayerId: string
  uploadTime: string
  processStatus: string
  taxpayerName: string
  processType: string
  processTime: string | null
}

export default function FinancePage() {
  const [data, setData] = useState<FinanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useState({
    startDate: "",
    endDate: "",
    enterpriseName: "",
    processStatus: "all"
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

      const response = await fetch(`/api/finance?${queryParams.toString()}`)
      if (!response.ok) throw new Error("获取数据失败")
      
      const records = await response.json()
      setData(records)
    } catch (error) {
      console.error("获取财税记录失败:", error)
      toast.error("获取财税记录失败")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSearch = () => {
    fetchData()
  }

  const handleView = (id: string) => {
    // 实现查看逻辑
    console.log("查看文件:", id)
  }

  const handleInputChange = (field: string, value: string) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">财税管理</h1>
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
            value={searchParams.processStatus}
            onValueChange={(value) => handleInputChange("processStatus", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="全部状态" />
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
              <TableHead>文件名称</TableHead>
              <TableHead>纳税金额</TableHead>
              <TableHead>年度</TableHead>
              <TableHead>所属期间</TableHead>
              <TableHead>纳税人识别号</TableHead>
              <TableHead>上传时间</TableHead>
              <TableHead>处理状态</TableHead>
              <TableHead>纳税人名称</TableHead>
              <TableHead>处理方式</TableHead>
              <TableHead className="w-[100px]">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={11} className="h-24 text-center">
                  加载中...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} className="h-24 text-center">
                  暂无数据
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.fileName}</TableCell>
                  <TableCell>{item.taxNumber.toLocaleString("zh-CN", { style: "currency", currency: "CNY" })}</TableCell>
                  <TableCell>{item.year}</TableCell>
                  <TableCell>{item.period}</TableCell>
                  <TableCell>{item.taxpayerId}</TableCell>
                  <TableCell>{format(new Date(item.uploadTime), "yyyy-MM-dd HH:mm")}</TableCell>
                  <TableCell>
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                      item.processStatus === "未处理" ? "bg-yellow-100 text-yellow-800" :
                      item.processStatus === "处理中" ? "bg-blue-100 text-blue-800" :
                      "bg-green-100 text-green-800"
                    }`}>
                      {item.processStatus}
                    </span>
                  </TableCell>
                  <TableCell>{item.taxpayerName}</TableCell>
                  <TableCell>{item.processType}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => handleView(item.id)}>
                      <Eye className="h-4 w-4" />
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
