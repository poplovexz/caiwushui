import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { z } from "zod"

import { db } from "@/lib/prisma"
import { authOptions } from "@/lib/auth-options"
import { enterpriseSchema } from "@/types/enterprise"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const enterprise = await db.enterprise.findUnique({
      where: {
        id: params.id,
        deletedAt: null,
      },
    })

    if (!enterprise) {
      return new NextResponse("Not found", { status: 404 })
    }

    return NextResponse.json(enterprise)
  } catch (error) {
    console.error("[ENTERPRISE_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const validatedData = enterpriseSchema.partial().parse(body)

    const enterprise = await db.enterprise.update({
      where: {
        id: params.id,
        deletedAt: null,
      },
      data: validatedData,
    })

    return NextResponse.json(enterprise)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.errors), { status: 400 })
    }

    console.error("[ENTERPRISE_PATCH]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const enterprise = await db.enterprise.update({
      where: {
        id: params.id,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    })

    return NextResponse.json(enterprise)
  } catch (error) {
    console.error("[ENTERPRISE_DELETE]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}
