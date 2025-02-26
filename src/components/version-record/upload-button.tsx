"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

interface UploadButtonProps {
  onSuccess?: () => void
}

export function UploadButton({ onSuccess }: UploadButtonProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [enterpriseId, setEnterpriseId] = useState("")
  const [enterprises, setEnterprises] = useState([])
  const { toast } = useToast()

  // 获取企业列表
  const fetchEnterprises = async () => {
    try {
      const response = await fetch("/api/enterprises")
      const data = await response.json()
      setEnterprises(data.enterprises)
    } catch (error) {
      console.error("获取企业列表失败:", error)
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !enterpriseId) {
      toast({
        title: "错误",
        description: "请选择文件和企业",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    const formData = new FormData()
    formData.append("file", file)
    formData.append("enterpriseId", enterpriseId)

    try {
      const response = await fetch("/api/version-records/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("上传失败")
      }

      toast({
        title: "成功",
        description: "文件上传成功",
      })

      setOpen(false)
      onSuccess?.()
    } catch (error) {
      console.error("上传失败:", error)
      toast({
        title: "错误",
        description: "文件上传失败，请重试",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => fetchEnterprises()}>上传文件</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>上传新文件</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="enterprise">选择企业</Label>
            <Select
              value={enterpriseId}
              onValueChange={setEnterpriseId}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择企业" />
              </SelectTrigger>
              <SelectContent>
                {enterprises.map((enterprise: any) => (
                  <SelectItem
                    key={enterprise.id}
                    value={enterprise.id}
                  >
                    {enterprise.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="file">选择文件</Label>
            <Input
              id="file"
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              accept=".pdf,.doc,.docx"
            />
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "上传中..." : "上传"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
