"use client"

import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams?.get("error")

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            登录失败
          </h1>
          <p className="text-sm text-muted-foreground">
            {error === "CredentialsSignin"
              ? "邮箱或密码错误"
              : "登录时发生错误"}
          </p>
        </div>
        <Button asChild>
          <Link href="/(auth)/signin">
            返回登录
          </Link>
        </Button>
      </div>
    </div>
  )
}
