"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { EnterpriseActionButton } from "./enterprise-action-button"

interface Enterprise {
  id: string
  name: string
  unifiedSocialCode: string
  legalPerson: string
  registeredCapital: number
  status: string
  establishmentDate: string
  registrationAuthority: string
  approvalDate: string
}

export function EnterpriseList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [enterprises, setEnterprises] = useState<Enterprise[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // 获取企业列表数据
  const fetchEnterprises = useCallback(async () => {
    try {
      setLoading(true)
      setError("")
      const searchParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        ...(searchTerm && { search: searchTerm }),
      })

      const response = await fetch("/api/enterprises?" + searchParams.toString())
      if (!response.ok) {
        throw new Error(response.statusText || "获取数据失败")
      }
      
      const data = await response.json()
      setEnterprises(data.items || [])
    } catch (error) {
      console.error("获取企业列表失败:", error)
      setError("获取数据失败，请稍后重试")
    } finally {
      setLoading(false)
    }
  }, [currentPage, searchTerm])

  // 搜索企业
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchEnterprises()
  }

  // 初始加载数据
  useEffect(() => {
    fetchEnterprises()
  }, [fetchEnterprises])

  return (
    <div className="space-y-4">
      {/* 搜索栏 */}
      <div className="flex justify-between items-center">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="搜索企业名称/统一社会信用代码"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border rounded-md w-80"
          />
          <Button 
            type="submit"
            variant="primary"
            disabled={loading}
          >
            {loading ? "搜索中..." : "搜索"}
          </Button>
        </form>
        <EnterpriseActionButton
          href="/enterprises/new"
          variant="primary"
        >
          新增企业
        </EnterpriseActionButton>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* 企业列表表格 */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">企业名称</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">统一社会信用代码</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">法人代表</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">注册资本</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">经营状态</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">成立日期</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">操作</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {enterprises.map((enterprise) => (
              <tr key={enterprise.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{enterprise.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{enterprise.unifiedSocialCode}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{enterprise.legalPerson}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{enterprise.registeredCapital}万元</td>
                <td className="px-6 py-4 text-sm text-gray-500">{enterprise.status}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(enterprise.establishmentDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 space-x-2">
                  <EnterpriseActionButton
                    href={`/enterprises/${enterprise.id}`}
                    variant="secondary"
                    size="sm"
                  >
                    详情
                  </EnterpriseActionButton>
                  <EnterpriseActionButton
                    href={`/enterprises/${enterprise.id}/edit`}
                    variant="secondary"
                    size="sm"
                  >
                    编辑
                  </EnterpriseActionButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 加载状态 */}
      {loading && (
        <div className="flex justify-center py-4">
          <div>加载中...</div>
        </div>
      )}

      {/* 空状态 */}
      {!loading && enterprises.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          暂无企业数据
        </div>
      )}
    </div>
  )
}
