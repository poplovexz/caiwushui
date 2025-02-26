import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"

import { EnterprisesContainer } from "@/components/enterprise/enterprises-container"
import { authOptions } from "@/lib/auth-options"

export default async function EnterprisesPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/(auth)/signin")
  }

  return <EnterprisesContainer />
}
