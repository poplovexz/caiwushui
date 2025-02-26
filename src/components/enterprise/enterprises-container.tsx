"use client"

import { EnterpriseList } from "./enterprise-list"
import { Heading } from "@/components/ui/heading"

export function EnterprisesContainer() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Heading
        title="企业管理"
        description="管理和查看企业信息"
      />
      <EnterpriseList />
    </div>
  )
}
