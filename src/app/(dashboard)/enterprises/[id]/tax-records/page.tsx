import { Suspense } from "react"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft, Plus } from "lucide-react"
import { TaxRecordList } from "@/components/tax-record/tax-record-list"
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
    include: {
      taxRecords: {
        where: {
          deletedAt: null,
        },
        orderBy: [
          { year: "desc" },
          { month: "desc" },
        ],
      },
    },
  })

  if (!enterprise) {
    notFound()
  }

  return enterprise
}

export default async function TaxRecordsPage({ params }: Props) {
  const enterprise = await getEnterprise(params.id)

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href={`/enterprises/${params.id}`}>
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <Heading
            title="税收记录"
            description={`${enterprise.name}的税收记录管理。`}
          />
        </div>
        <Link href={`/enterprises/${params.id}/tax-records/new`}>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            新增记录
          </Button>
        </Link>
      </div>
      <Separator />
      <Suspense fallback={<div>加载中...</div>}>
        <TaxRecordList enterpriseId={params.id} initialRecords={enterprise.taxRecords} />
      </Suspense>
    </div>
  )
}
