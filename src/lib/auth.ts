import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/auth/config/auth-options"
import { UserRole } from "@/types/auth"

// 获取服务端session
export async function getSession() {
  const session = await getServerSession(authOptions)
  return session
}

// 获取当前用户
export async function getCurrentUser() {
  const session = await getSession()
  return session?.user
}

// 检查是否已认证
export async function checkAuth() {
  const session = await getSession()
  if (!session) {
    redirect("/auth/signin")
  }
  return session
}

// 检查管理员权限
export async function checkAdmin() {
  const session = await getSession()
  if (!session || session.user.role !== UserRole.ADMIN) {
    redirect("/403")
  }
  return session
}

// 处理认证错误
export async function handleAuthError(error: Error) {
  console.error("Auth error:", error)
  
  if (error.message.includes("Database")) {
    return {
      error: "数据库连接错误，请稍后重试",
      code: "DATABASE_ERROR"
    }
  }
  
  if (error.message.includes("credentials")) {
    return {
      error: "邮箱或密码错误",
      code: "INVALID_CREDENTIALS"
    }
  }
  
  return {
    error: "认证服务暂时不可用，请稍后重试",
    code: "AUTH_ERROR"
  }
}

// 刷新session
export async function refreshSession() {
  try {
    const response = await fetch("/api/auth/session", {
      method: "GET",
      credentials: "include"
    })
    
    if (!response.ok) {
      redirect("/auth/signin")
    }
    
    return await response.json()
  } catch (error) {
    if (error instanceof Error) {
      return handleAuthError(error)
    }
    throw error
  }
}
