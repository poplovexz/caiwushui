import { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "企业管理",
  description: "管理系统中的企业信息",
}

export default function EnterprisesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">企业管理</h3>
          <p className="text-sm text-muted-foreground">
            管理系统中的企业信息和相关配置
          </p>
        </div>
        <Link href="/enterprises/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            新增企业
          </Button>
        </Link>
      </div>
      
      <div className="rounded-md border">
        <div className="p-4">
          <div className="text-center py-6">
            <p className="text-muted-foreground">请前往企业管理页面查看企业列表</p>
            <Link href="/enterprises" className="mt-2 inline-block">
              <Button variant="outline" className="mt-2">
                前往企业管理
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
