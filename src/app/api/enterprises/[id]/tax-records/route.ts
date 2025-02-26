import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth/config/auth-options"
import { db } from "@/lib/prisma"
import * as z from "zod"

const postSchema = z.object({
  year: z.number().min(2000).max(2100),
  month: z.number().min(1).max(12),
  taxableIncome: z.number().min(0),
  taxAmount: z.number().min(0),
  paidAmount: z.number().min(0),
  taxType: z.string().min(1),
  paymentStatus: z.string().min(1),
  dueDate: z.string().min(1),
  paymentDate: z.string().optional(),
  remarks: z.string().optional(),
})

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const records = await db.taxRecord.findMany({
      where: {
        enterpriseId: params.id,
        deletedAt: null,
      },
      orderBy: [
        { year: "desc" },
        { month: "desc" },
      ],
    })

    return NextResponse.json(records)
  } catch (error) {
    console.error("[TAX_RECORDS_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const json = await req.json()
    const body = postSchema.parse(json)

    const record = await db.taxRecord.create({
      data: {
        ...body,
        enterpriseId: params.id,
      },
    })

    return NextResponse.json(record)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid request data", { status: 400 })
    }

    console.error("[TAX_RECORDS_POST]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}
