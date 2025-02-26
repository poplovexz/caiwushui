import { Metadata } from "next"
import { UserList } from "@/components/settings/users/user-list"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "用户管理",
  description: "管理系统用户",
}

export default async function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">用户管理</h3>
          <p className="text-sm text-muted-foreground">
            管理系统用户账号和权限
          </p>
        </div>
        <Link href="/settings/users/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            新增用户
          </Button>
        </Link>
      </div>
      <UserList />
    </div>
  )
}
