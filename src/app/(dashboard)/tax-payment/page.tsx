"use client"

import { TaxPaymentSearch } from "@/components/tax-payment/tax-payment-search"
import { TaxPaymentTable } from "@/components/tax-payment/tax-payment-table"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import { useState, useRef } from "react"
import { toast } from "sonner"

// 模拟数据
const mockFiles = [
  {
    id: "1",
    fileName: "2024年1月增值税完税证明.pdf",
    fileType: "增值税",
    processStatus: "已处理",
    processTime: "2024-01-15T08:30:00Z",
    serialNumber: "NO20240115001",
    enterpriseId: "ent001",
    enterpriseName: "深圳市科技有限公司",
    taxpayerId: "91440300MA5D7GXXXX",
    totalAmount: 25000.00,
    uploadTime: "2024-01-15T08:00:00Z",
    filePath: "/uploads/tax/2024/01/vat-001.pdf",
  },
  {
    id: "2",
    fileName: "2024年1月企业所得税完税证明.pdf",
    fileType: "企业所得税",
    processStatus: "已处理",
    processTime: "2024-01-20T09:15:00Z",
    serialNumber: "NO20240120001",
    enterpriseId: "ent001",
    enterpriseName: "深圳市科技有限公司",
    taxpayerId: "91440300MA5D7GXXXX",
    totalAmount: 150000.00,
    uploadTime: "2024-01-20T09:00:00Z",
    filePath: "/uploads/tax/2024/01/income-001.pdf",
  },
  {
    id: "3",
    fileName: "2024年2月增值税完税证明.pdf",
    fileType: "增值税",
    processStatus: "处理中",
    processTime: null,
    serialNumber: "NO20240215001",
    enterpriseId: "ent002",
    enterpriseName: "广州市贸易有限公司",
    taxpayerId: "91440100MA5E8HXXXX",
    totalAmount: 18000.00,
    uploadTime: "2024-02-15T10:30:00Z",
    filePath: "/uploads/tax/2024/02/vat-001.pdf",
  },
  {
    id: "4",
    fileName: "2024年2月印花税完税证明.pdf",
    fileType: "印花税",
    processStatus: "未处理",
    processTime: null,
    serialNumber: "NO20240220001",
    enterpriseId: "ent002",
    enterpriseName: "广州市贸易有限公司",
    taxpayerId: "91440100MA5E8HXXXX",
    totalAmount: 2000.00,
    uploadTime: "2024-02-20T14:20:00Z",
    filePath: "/uploads/tax/2024/02/stamp-001.pdf",
  },
  {
    id: "5",
    fileName: "2024年2月个人所得税完税证明.pdf",
    fileType: "个人所得税",
    processStatus: "已处理",
    processTime: "2024-02-25T16:45:00Z",
    serialNumber: "NO20240225001",
    enterpriseId: "ent003",
    enterpriseName: "东莞市制造有限公司",
    taxpayerId: "91441900MA5F9JXXXX",
    totalAmount: 45000.00,
    uploadTime: "2024-02-25T16:30:00Z",
    filePath: "/uploads/tax/2024/02/personal-001.pdf",
  }
]

export default function TaxPaymentPage() {
  const [files, setFiles] = useState(mockFiles)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSearch = async (values: any) => {
    console.log('Search values:', values)
    // 模拟搜索功能
    const filteredFiles = mockFiles.filter(file => {
      if (values.enterpriseName && !file.enterpriseName.includes(values.enterpriseName)) {
        return false
      }
      if (values.fileType && file.fileType !== values.fileType) {
        return false
      }
      if (values.processStatus && file.processStatus !== values.processStatus) {
        return false
      }
      if (values.dateRange) {
        const uploadDate = new Date(file.uploadTime)
        const [startDate, endDate] = values.dateRange
        if (startDate && uploadDate < startDate) {
          return false
        }
        if (endDate && uploadDate > endDate) {
          return false
        }
      }
      return true
    })
    setFiles(filteredFiles)
  }

  const handleView = (id: string) => {
    const file = files.find(f => f.id === id)
    console.log('View file:', file)
    // TODO: 实现文件预览功能
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      try {
        setIsUploading(true)
        // 模拟上传延迟
        await new Promise(resolve => setTimeout(resolve, 1500))

        const newFile = {
          id: String(files.length + 1),
          fileName: file.name,
          fileType: "未知",
          processStatus: "未处理",
          processTime: null,
          serialNumber: `NO${new Date().getTime()}`,
          enterpriseId: "ent001",
          enterpriseName: "深圳市科技有限公司",
          taxpayerId: "91440300MA5D7GXXXX",
          totalAmount: 0,
          uploadTime: new Date().toISOString(),
          filePath: `/uploads/tax/${file.name}`,
        }
        setFiles(prev => [newFile, ...prev])
        toast.success("文件上传成功")
      } catch (error) {
        toast.error("文件上传失败")
      } finally {
        setIsUploading(false)
        // 清理input，允许上传相同文件
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      }
    }
  }

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">完税信息</h1>
        <div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
          />
          <Button onClick={handleUploadClick} disabled={isUploading}>
            <Upload className="mr-2 h-4 w-4" />
            {isUploading ? "上传中..." : "上传文件"}
          </Button>
        </div>
      </div>
      <div className="mt-6">
        <TaxPaymentSearch onSearch={handleSearch} />
      </div>
      <div className="mt-6">
        <TaxPaymentTable
          data={files}
          onView={handleView}
        />
      </div>
    </div>
  )
}
