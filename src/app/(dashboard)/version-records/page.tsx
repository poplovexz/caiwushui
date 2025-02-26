"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"
import { UploadButton } from "@/components/version-record/upload-button"

export default function VersionRecordsPage() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/version-records")
        const json = await response.json()
        setData(json.records)
      } catch (error) {
        console.error("获取版本记录失败:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">版本记录管理</h1>
        <UploadButton onSuccess={() => {
          // 重新加载数据
          setLoading(true)
          fetchData()
        }} />
      </div>
      <Separator className="my-6" />
      
      <Card>
        <CardHeader>
          <CardTitle>版本记录列表</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={data} loading={loading} />
        </CardContent>
      </Card>
    </div>
  )
}
