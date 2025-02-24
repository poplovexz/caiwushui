import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import { UserRole } from "./types/auth"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // 公开路由列表
    const publicRoutes = ["/", "/auth/signin", "/auth/signup"]
    
    // 如果是登录页且用户已登录，重定向到首页
    if (path === "/auth/signin" && token) {
      return NextResponse.redirect(new URL("/", req.url))
    }

    // 如果是公开路由，允许访问
    if (publicRoutes.includes(path)) {
      return NextResponse.next()
    }

    // 如果用户未登录，重定向到登录页
    if (!token) {
      const signInUrl = new URL("/auth/signin", req.url)
      signInUrl.searchParams.set("callbackUrl", path)
      return NextResponse.redirect(signInUrl)
    }

    // 如果用户已登录，允许访问
    return NextResponse.next()
  },
  {
    pages: {
      signIn: "/auth/signin",
    },
  }
)

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
}
