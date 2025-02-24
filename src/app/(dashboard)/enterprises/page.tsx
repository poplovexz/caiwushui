import { Suspense } from "react"
import { EnterpriseList } from "../../../components/enterprise/enterprise-list"
import { EnterpriseSearch } from "../../../components/enterprise/enterprise-search"
import { Heading } from "../../../components/ui/heading"
import { Separator } from "../../../components/ui/separator"
import { CreateEnterprise } from "../../../components/enterprise/create-enterprise"

export default function EnterprisesPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <Heading
          title="企业管理"
          description="管理系统中的企业信息，支持添加、编辑和删除操作。"
        />
        <CreateEnterprise />
      </div>
      <Separator />
      <EnterpriseSearch />
      <Suspense fallback={<div>加载中...</div>}>
        <EnterpriseList />
      </Suspense>
    </div>
  )
}
