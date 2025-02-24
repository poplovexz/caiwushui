import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/auth/config/auth-options"
import { SignInForm } from "@/components/auth/forms/signin-form"

export default async function SignInPage({
  searchParams,
}: {
  searchParams?: { callbackUrl?: string }
}) {
  const session = await getServerSession(authOptions)
  
  if (session) {
    redirect("/")
  }

  // 确保回调URL不是登录页面本身
  const callbackUrl = searchParams?.callbackUrl && !searchParams.callbackUrl.includes("/auth/signin")
    ? searchParams.callbackUrl
    : "/"

  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">登录</h1>
          <p className="mt-2 text-sm text-gray-600">
            请输入您的账号信息
          </p>
        </div>
        <SignInForm callbackUrl={callbackUrl} />
      </div>
    </div>
  )
}
