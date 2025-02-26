"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Pencil, Trash } from "lucide-react"

interface Enterprise {
  id: string
  name: string
  unifiedSocialCode: string
  legalPerson: string
  registeredCapital: number
  paidInCapital: number | null
  status: string
  establishmentDate: string
  registrationAuthority: string
  approvalDate: string
  businessScope: string
  type: string
  industry: string
  district: string
  address: string
  contactPhone: string | null
  email: string | null
  website: string | null
  taxpayerType: string | null
  taxationAuthority: string | null
  socialSecurityNo: string | null
  employeeCount: number | null
}

interface EnterpriseDetailProps {
  id: string
  initialData: Enterprise
}

export function EnterpriseDetail({ id, initialData }: EnterpriseDetailProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleEdit = () => {
    router.push(`/enterprises/${id}/edit`)
  }

  const handleDelete = async () => {
    if (!confirm("确定要删除这个企业吗？")) {
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`/api/enterprises/${id}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("删除企业失败")
      }

      toast.success("企业已删除")
      router.push("/enterprises")
      router.refresh()
    } catch (err) {
      console.error("删除企业失败:", err)
      toast.error("删除企业失败")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end space-x-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleEdit}
          disabled={loading}
        >
          <Pencil className="h-4 w-4 mr-2" />
          编辑
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          disabled={loading}
        >
          <Trash className="h-4 w-4 mr-2" />
          删除
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-500">企业名称</h3>
          <p className="text-base">{initialData.name}</p>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-500">统一社会信用代码</h3>
          <p className="text-base">{initialData.unifiedSocialCode}</p>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-500">法定代表人</h3>
          <p className="text-base">{initialData.legalPerson}</p>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-500">注册资本</h3>
          <p className="text-base">{initialData.registeredCapital}万元</p>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-500">实缴资本</h3>
          <p className="text-base">
            {initialData.paidInCapital ? `${initialData.paidInCapital}万元` : "-"}
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-500">企业状态</h3>
          <p className="text-base">{initialData.status}</p>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-500">成立日期</h3>
          <p className="text-base">
            {new Date(initialData.establishmentDate).toLocaleDateString("zh-CN")}
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-500">登记机关</h3>
          <p className="text-base">{initialData.registrationAuthority}</p>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-500">核准日期</h3>
          <p className="text-base">
            {new Date(initialData.approvalDate).toLocaleDateString("zh-CN")}
          </p>
        </div>

        <div className="space-y-2 md:col-span-2 lg:col-span-3">
          <h3 className="text-sm font-medium text-gray-500">经营范围</h3>
          <p className="text-base">{initialData.businessScope}</p>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-500">企业类型</h3>
          <p className="text-base">{initialData.type}</p>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-500">所属行业</h3>
          <p className="text-base">{initialData.industry}</p>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-500">所在地区</h3>
          <p className="text-base">{initialData.district}</p>
        </div>

        <div className="space-y-2 md:col-span-2 lg:col-span-3">
          <h3 className="text-sm font-medium text-gray-500">企业地址</h3>
          <p className="text-base">{initialData.address}</p>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-500">联系电话</h3>
          <p className="text-base">{initialData.contactPhone || "-"}</p>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-500">电子邮箱</h3>
          <p className="text-base">{initialData.email || "-"}</p>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-500">企业网站</h3>
          <p className="text-base">{initialData.website || "-"}</p>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-500">纳税人类型</h3>
          <p className="text-base">{initialData.taxpayerType || "-"}</p>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-500">税务机关</h3>
          <p className="text-base">{initialData.taxationAuthority || "-"}</p>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-500">社保号</h3>
          <p className="text-base">{initialData.socialSecurityNo || "-"}</p>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-500">员工人数</h3>
          <p className="text-base">
            {initialData.employeeCount ? `${initialData.employeeCount}人` : "-"}
          </p>
        </div>
      </div>
    </div>
  )
}
