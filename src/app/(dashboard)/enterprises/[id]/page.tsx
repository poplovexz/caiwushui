import { Suspense } from "react"
import { EnterpriseDetail } from "../../../../components/enterprise/enterprise-detail"
import { Heading } from "../../../../components/ui/heading"
import { Separator } from "../../../../components/ui/separator"
import { Button } from "../../../../components/ui/button"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { db } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth/config/auth-options"

interface Props {
  params: { id: string }
}

async function getEnterprise(id: string) {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error("Unauthorized")
  }

  const enterprise = await db.enterprise.findUnique({
    where: {
      id: id,
      deletedAt: null,
    },
  })

  if (!enterprise) {
    notFound()
  }

  return enterprise
}

export default async function EnterprisePage({ params }: Props) {
  const enterprise = await getEnterprise(params.id)

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/enterprises">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <Heading
            title="企业详情"
            description="查看企业的详细信息和相关数据。"
          />
        </div>
      </div>
      <Separator />
      <Suspense fallback={<div>加载中...</div>}>
        <EnterpriseDetail initialData={enterprise} id={params.id} />
      </Suspense>
    </div>
  )
}
