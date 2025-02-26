import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { z } from "zod"

import { db } from "@/lib/prisma"
import { authOptions } from "@/lib/auth-options"
import { enterpriseSchema } from "@/types/enterprise"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status")

    const where = {
      deletedAt: null,
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { unifiedSocialCode: { contains: search, mode: "insensitive" } },
          { legalPerson: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(status && { status }),
    }

    const [total, items] = await Promise.all([
      db.enterprise.count({ where }),
      db.enterprise.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
    ])

    return NextResponse.json({
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error("[ENTERPRISES_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const validatedData = enterpriseSchema.parse(body)

    const enterprise = await db.enterprise.create({
      data: validatedData,
    })

    return NextResponse.json(enterprise)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.errors), { status: 400 })
    }

    console.error("[ENTERPRISES_POST]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}
