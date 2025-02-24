"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { cn } from "@/lib/utils"
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
import { EnterpriseStatus, EnterpriseType } from "@/types/enterprise"

const formSchema = z.object({
  keyword: z.string().optional(),
  status: z.nativeEnum(EnterpriseStatus).optional(),
  type: z.nativeEnum(EnterpriseType).optional(),
  district: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

export function EnterpriseSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isAdvanced, setIsAdvanced] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      keyword: searchParams.get("keyword") || "",
      status: (searchParams.get("status") as EnterpriseStatus) || undefined,
      type: (searchParams.get("type") as EnterpriseType) || undefined,
      district: searchParams.get("district") || "",
      startDate: searchParams.get("startDate") || "",
      endDate: searchParams.get("endDate") || "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const params = new URLSearchParams()
    Object.entries(values).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      }
    })
    router.push(`/enterprises?${params.toString()}`)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex items-center space-x-4">
          <FormField
            control={form.control}
            name="keyword"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    placeholder="搜索企业名称、统一社会信用代码或法人"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">搜索</Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsAdvanced(!isAdvanced)}
          >
            {isAdvanced ? "收起" : "高级搜索"}
          </Button>
        </div>

        <div
          className={cn(
            "grid gap-4 transition-all",
            isAdvanced
              ? "grid-cols-1 md:grid-cols-3"
              : "hidden"
          )}
        >
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>经营状态</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="选择经营状态" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(EnterpriseStatus).map((status) => (
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
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>企业类型</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="选择企业类型" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(EnterpriseType).map((type) => (
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
            name="district"
            render={({ field }) => (
              <FormItem>
                <FormLabel>所属地区</FormLabel>
                <FormControl>
                  <Input placeholder="输入所属地区" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>注册开始日期</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>注册结束日期</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  )
}
