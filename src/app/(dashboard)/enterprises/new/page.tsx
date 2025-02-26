import { Suspense } from "react"
import { EnterpriseForm } from "@/components/enterprise/enterprise-form"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"

export default function NewEnterprisePage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <Heading
          title="新增企业"
          description="创建一个新的企业信息"
        />
      </div>
      <Separator />
      <Suspense fallback={<div>加载中...</div>}>
        <EnterpriseForm />
      </Suspense>
    </div>
  )
}
