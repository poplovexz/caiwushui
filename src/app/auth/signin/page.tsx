import { Metadata } from "next"
import Link from "next/link"
import { UserAuthForm } from "@/components/auth/user-auth-form"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "登录",
  description: "登录到您的账户",
}

export default function SignInPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute left-4 top-4 md:left-8 md:top-8"
        )}
      >
        返回
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            欢迎回来
          </h1>
          <p className="text-sm text-muted-foreground">
            请输入您的邮箱和密码登录
          </p>
        </div>
        <UserAuthForm />
        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link
            href="/auth/signup"
            className="hover:text-brand underline underline-offset-4"
          >
            没有账号？注册
          </Link>
        </p>
      </div>
    </div>
  )
}
