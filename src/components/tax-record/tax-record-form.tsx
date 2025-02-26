"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const formSchema = z.object({
  year: z.coerce
    .number()
    .min(2000, "年份不能小于2000年")
    .max(2100, "年份不能大于2100年"),
  month: z.coerce.number().min(1, "月份必须在1-12之间").max(12, "月份必须在1-12之间"),
  taxableIncome: z.coerce.number().min(0, "应纳税所得额不能为负"),
  taxAmount: z.coerce.number().min(0, "应纳税额不能为负"),
  paidAmount: z.coerce.number().min(0, "实缴税额不能为负"),
  taxType: z.string().min(1, "请选择税种"),
  paymentStatus: z.string().min(1, "请选择缴纳状态"),
  dueDate: z.string().min(1, "请选择应缴日期"),
  paymentDate: z.string().optional(),
  remarks: z.string().optional(),
})

const taxTypes = [
  "增值税",
  "企业所得税",
  "个人所得税",
  "房产税",
  "土地使用税",
  "车船税",
  "印花税",
  "环境保护税",
  "消费税",
  "其他",
]

const paymentStatuses = ["未缴纳", "部分缴纳", "已缴纳"]

interface TaxRecord {
  id: string
  year: number
  month: number
  taxableIncome: number
  taxAmount: number
  paidAmount: number
  taxType: string
  paymentStatus: string
  dueDate: string
  paymentDate: string | null
  remarks: string | null
}

interface TaxRecordFormProps {
  enterpriseId: string
  initialData?: TaxRecord
}

export function TaxRecordForm({ enterpriseId, initialData }: TaxRecordFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      year: initialData?.year || new Date().getFullYear(),
      month: initialData?.month || new Date().getMonth() + 1,
      taxableIncome: initialData?.taxableIncome || 0,
      taxAmount: initialData?.taxAmount || 0,
      paidAmount: initialData?.paidAmount || 0,
      taxType: initialData?.taxType || "",
      paymentStatus: initialData?.paymentStatus || "未缴纳",
      dueDate: initialData?.dueDate
        ? new Date(initialData.dueDate).toISOString().split("T")[0]
        : "",
      paymentDate: initialData?.paymentDate
        ? new Date(initialData.paymentDate).toISOString().split("T")[0]
        : "",
      remarks: initialData?.remarks || "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true)
      const url = initialData
        ? `/api/enterprises/${enterpriseId}/tax-records/${initialData.id}`
        : `/api/enterprises/${enterpriseId}/tax-records`
      const method = initialData ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error("保存失败")
      }

      router.push(`/enterprises/${enterpriseId}/tax-records`)
      router.refresh()
      toast.success(initialData ? "更新成功" : "创建成功")
    } catch (error) {
      console.error("保存失败:", error)
      toast.error("保存失败")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>年度</FormLabel>
                <FormControl>
                  <Input type="number" {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="month"
            render={({ field }) => (
              <FormItem>
                <FormLabel>月份</FormLabel>
                <FormControl>
                  <Input type="number" min={1} max={12} {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="taxType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>税种</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={loading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="请选择税种" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {taxTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="taxableIncome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>应纳税所得额</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="taxAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>应纳税额</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="paidAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>实缴税额</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="paymentStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>缴纳状态</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={loading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="请选择缴纳状态" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {paymentStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>应缴日期</FormLabel>
                <FormControl>
                  <Input type="date" {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="paymentDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>实际缴纳日期</FormLabel>
                <FormControl>
                  <Input type="date" {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="remarks"
          render={({ field }) => (
            <FormItem>
              <FormLabel>备注</FormLabel>
              <FormControl>
                <Textarea {...field} disabled={loading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            取消
          </Button>
          <Button type="submit" disabled={loading}>
            {initialData ? "更新" : "创建"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
