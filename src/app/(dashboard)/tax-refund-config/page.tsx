"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { toast } from "sonner"

interface TaxRefundConfig {
  id: string
  name: string
  rate: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function TaxRefundConfigPage() {
  const [configs, setConfigs] = useState<TaxRefundConfig[]>([])
  const [loading, setLoading] = useState(true)
  const [rates, setRates] = useState({
    companyRate: 45,
    personalRate: 45,
    landRate: 45,
    propertyRate: 45,
    otherRate: 45,
    totalRate: 45
  })

  const fetchConfigs = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/tax-refund-config")
      if (!response.ok) throw new Error("获取配置失败")
      const data = await response.json()
      setConfigs(data)
    } catch (error) {
      console.error("获取返税配置失败:", error)
      toast.error("获取返税配置失败")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchConfigs()
  }, [])

  const handleRateChange = (field: keyof typeof rates, value: string) => {
    const numValue = Math.min(Math.max(0, Number(value)), 100)
    setRates(prev => ({ ...prev, [field]: numValue }))
  }

  const handleSave = async () => {
    try {
      const response = await fetch("/api/tax-refund-config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(rates)
      })

      if (!response.ok) throw new Error("保存配置失败")
      toast.success("保存配置成功")
      fetchConfigs()
    } catch (error) {
      console.error("保存返税配置失败:", error)
      toast.error("保存返税配置失败")
    }
  }

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">返税配置</h1>
      </div>
      <div className="mt-6 max-w-2xl">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="w-32">企业所得税</label>
            <Input
              type="number"
              min={0}
              max={100}
              value={rates.companyRate}
              onChange={(e) => handleRateChange("companyRate", e.target.value)}
            />
            <span className="text-sm text-gray-500">%</span>
          </div>
          <div className="flex items-center gap-4">
            <label className="w-32">个人所得税</label>
            <Input
              type="number"
              min={0}
              max={100}
              value={rates.personalRate}
              onChange={(e) => handleRateChange("personalRate", e.target.value)}
            />
            <span className="text-sm text-gray-500">%</span>
          </div>
          <div className="flex items-center gap-4">
            <label className="w-32">土地使用税</label>
            <Input
              type="number"
              min={0}
              max={100}
              value={rates.landRate}
              onChange={(e) => handleRateChange("landRate", e.target.value)}
            />
            <span className="text-sm text-gray-500">%</span>
          </div>
          <div className="flex items-center gap-4">
            <label className="w-32">房产税</label>
            <Input
              type="number"
              min={0}
              max={100}
              value={rates.propertyRate}
              onChange={(e) => handleRateChange("propertyRate", e.target.value)}
            />
            <span className="text-sm text-gray-500">%</span>
          </div>
          <div className="flex items-center gap-4">
            <label className="w-32">其他税费</label>
            <Input
              type="number"
              min={0}
              max={100}
              value={rates.otherRate}
              onChange={(e) => handleRateChange("otherRate", e.target.value)}
            />
            <span className="text-sm text-gray-500">%</span>
          </div>
          <div className="flex items-center gap-4">
            <label className="w-32">总计</label>
            <Input
              type="number"
              min={0}
              max={100}
              value={rates.totalRate}
              onChange={(e) => handleRateChange("totalRate", e.target.value)}
            />
            <span className="text-sm text-gray-500">%</span>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button onClick={handleSave}>保存配置</Button>
        </div>
      </div>
    </div>
  )
}
