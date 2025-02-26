import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import { UserRole } from "./types/auth"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // 公开路由列表
    const publicRoutes = ["/", "/signin"]
    
    // 如果是登录页且用户已登录，重定向到首页
    if (path === "/signin" && token) {
      return NextResponse.redirect(new URL("/", req.url))
    }

    // 如果是公开路由，允许访问
    if (publicRoutes.includes(path)) {
      return NextResponse.next()
    }

    // 如果用户未登录，重定向到登录页
    if (!token) {
      const signInUrl = new URL("/signin", req.url)
      signInUrl.searchParams.set("callbackUrl", path)
      return NextResponse.redirect(signInUrl)
    }

    // 如果用户已登录，允许访问
    return NextResponse.next()
  },
  {
    pages: {
      signIn: "/signin",
    },
  }
)

export const config = {
  matcher: [
    /*
     * 匹配所有路径除了:
     * 1. /api 开头的路径 (API 路由)
     * 2. /_next 开头的路径 (Next.js 内部路由)
     * 3. /favicon.ico (浏览器图标)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
