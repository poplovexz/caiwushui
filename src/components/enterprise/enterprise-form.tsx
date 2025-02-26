"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface EnterpriseFormData {
  name: string
  unifiedSocialCode: string
  legalPerson: string
  registeredCapital: number
  status: string
  establishmentDate: string
  registrationAuthority: string
  type: string
  industry: string
  district: string
  address: string
  contactPhone: string
  email: string
}

interface EnterpriseFormProps {
  initialData?: EnterpriseFormData
  isEditing?: boolean
}

export function EnterpriseForm({ initialData, isEditing = false }: EnterpriseFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState<EnterpriseFormData>(
    initialData || {
      name: "",
      unifiedSocialCode: "",
      legalPerson: "",
      registeredCapital: 0,
      status: "正常",
      establishmentDate: "",
      registrationAuthority: "",
      type: "",
      industry: "",
      district: "",
      address: "",
      contactPhone: "",
      email: "",
    }
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      const response = await fetch("/api/enterprises", {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("提交失败")
      }

      router.push("/enterprises")
      router.refresh()
    } catch (error) {
      console.error("提交企业信息失败:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">企业名称</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">统一社会信用代码</label>
          <input
            type="text"
            name="unifiedSocialCode"
            value={formData.unifiedSocialCode}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">法人代表</label>
          <input
            type="text"
            name="legalPerson"
            value={formData.legalPerson}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">注册资本（万元）</label>
          <input
            type="number"
            name="registeredCapital"
            value={formData.registeredCapital}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">成立日期</label>
          <input
            type="date"
            name="establishmentDate"
            value={formData.establishmentDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">登记机关</label>
          <input
            type="text"
            name="registrationAuthority"
            value={formData.registrationAuthority}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.back()}
        >
          取消
        </Button>
        <Button
          type="submit"
          disabled={loading}
        >
          {loading ? "提交中..." : isEditing ? "保存" : "创建"}
        </Button>
      </div>
    </form>
  )
}
