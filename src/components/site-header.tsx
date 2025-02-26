"use client"

import * as React from "react"
import Link from "next/link"
import { signOut } from "next-auth/react"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold">企业信息管理系统</span>
          </Link>
          <nav className="flex gap-6">
            <Link
              href="/enterprises"
              className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900"
            >
              企业管理
            </Link>
            <Link
              href="/tax"
              className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900"
            >
              税收信息
            </Link>
            <Link
              href="/social-security"
              className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900"
            >
              社保信息
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => signOut({ callbackUrl: "/(auth)/signin" })}
            className="text-sm font-medium text-gray-500 hover:text-gray-900"
          >
            退出登录
          </button>
        </div>
      </div>
    </header>
  )
}
