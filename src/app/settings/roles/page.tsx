import { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "角色权限",
  description: "管理系统角色和权限",
}

export default function RolesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">角色权限</h3>
          <p className="text-sm text-muted-foreground">
            管理系统角色和权限分配
          </p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          新增角色
        </Button>
      </div>
      
      <div className="rounded-md border">
        <div className="p-4">
          <div className="text-center py-6">
            <p className="text-muted-foreground">角色列表将在此显示</p>
          </div>
        </div>
      </div>
    </div>
  )
}
