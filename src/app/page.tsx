import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/auth/config/auth-options"

export default async function Home() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/auth/signin")
  }
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">欢迎回来, {session.user?.name}</h1>
    </div>
  )
}
