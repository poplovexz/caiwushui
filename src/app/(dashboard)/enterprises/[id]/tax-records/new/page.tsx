import { Suspense } from "react"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { TaxRecordForm } from "@/components/tax-record/tax-record-form"
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

export default async function NewTaxRecordPage({ params }: Props) {
  const enterprise = await getEnterprise(params.id)

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href={`/enterprises/${params.id}/tax-records`}>
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <Heading
            title="新增税收记录"
            description={`为${enterprise.name}添加新的税收记录。`}
          />
        </div>
      </div>
      <Separator />
      <Suspense fallback={<div>加载中...</div>}>
        <TaxRecordForm enterpriseId={params.id} />
      </Suspense>
    </div>
  )
}
