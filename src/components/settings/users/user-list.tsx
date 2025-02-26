"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Pencil, Trash2, Lock, Unlock } from "lucide-react"
import { useRouter } from "next/navigation"
import { UserRole } from "@prisma/client"
import { useToast } from "@/components/ui/use-toast"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

type User = {
  id: string
  name: string
  email: string
  role: UserRole
  status: string
  lastLoginAt: string | null
}

export function UserList() {
  const router = useRouter()
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)
  
  // 获取用户列表
  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/settings/users')
      if (!response.ok) {
        throw new Error('获取用户列表失败')
      }
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      toast({
        title: "错误",
        description: "获取用户列表失败",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }
  
  // 删除用户
  const deleteUser = async (id: string) => {
    try {
      const response = await fetch(`/api/settings/users/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('删除用户失败')
      }
      
      toast({
        title: "成功",
        description: "用户已删除",
      })
      
      // 刷新用户列表
      fetchUsers()
    } catch (error) {
      toast({
        title: "错误",
        description: "删除用户失败",
        variant: "destructive",
      })
    } finally {
      setUserToDelete(null)
    }
  }
  
  // 更改用户状态
  const toggleUserStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    
    try {
      const response = await fetch(`/api/settings/users/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })
      
      if (!response.ok) {
        throw new Error('更新用户状态失败')
      }
      
      toast({
        title: "成功",
        description: `用户状态已更新为${newStatus === 'ACTIVE' ? '激活' : '禁用'}`,
      })
      
      // 刷新用户列表
      fetchUsers()
    } catch (error) {
      toast({
        title: "错误",
        description: "更新用户状态失败",
        variant: "destructive",
      })
    }
  }
  
  // 编辑用户
  const editUser = (id: string) => {
    router.push(`/settings/users/${id}`)
  }
  
  // 角色显示名称
  const roleNames = {
    [UserRole.ADMIN]: '系统管理员',
    [UserRole.MANAGER]: '企业管理员',
    [UserRole.USER]: '普通用户',
  }
  
  // 状态徽章
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge variant="outline" className="bg-green-100 text-green-800">激活</Badge>
      case 'INACTIVE':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">禁用</Badge>
      case 'LOCKED':
        return <Badge variant="outline" className="bg-red-100 text-red-800">锁定</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }
  
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>用户名</TableHead>
              <TableHead>邮箱</TableHead>
              <TableHead>角色</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>最后登录</TableHead>
              <TableHead className="w-[100px]">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  加载中...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  暂无用户数据
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{roleNames[user.role]}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString('zh-CN') : '从未登录'}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">操作</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => editUser(user.id)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          编辑
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleUserStatus(user.id, user.status)}>
                          {user.status === 'ACTIVE' ? (
                            <>
                              <Lock className="mr-2 h-4 w-4" />
                              禁用
                            </>
                          ) : (
                            <>
                              <Unlock className="mr-2 h-4 w-4" />
                              激活
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => setUserToDelete(user.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          删除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* 删除确认对话框 */}
      <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              您确定要删除此用户吗？此操作不可撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => userToDelete && deleteUser(userToDelete)}
              className="bg-red-600 hover:bg-red-700"
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
