"use client"

import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CalendarIcon } from "lucide-react"

const formSchema = z.object({
  enterpriseName: z.string().optional(),
  fileType: z.string().optional(),
  processStatus: z.string().optional(),
  dateRange: z.array(z.date().optional()).optional(),
})

const fileTypes = [
  "增值税",
  "企业所得税",
  "个人所得税",
  "印花税",
]

const processStatuses = [
  "未处理",
  "处理中",
  "已处理",
]

export function TaxPaymentSearch({ onSearch }: { onSearch: (values: any) => void }) {
  const form = useForm<z.infer<typeof formSchema>>()

  function onSubmit(values: z.infer<typeof formSchema>) {
    onSearch(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-4">
        <FormField
          control={form.control}
          name="enterpriseName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>企业名称</FormLabel>
              <FormControl>
                <Input placeholder="请输入企业名称" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fileType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>文件类型</FormLabel>
              <Select onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="选择文件类型" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {fileTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="processStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>处理状态</FormLabel>
              <Select onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="选择处理状态" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {processStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dateRange"
          render={({ field }) => (
            <FormItem>
              <FormLabel>上传时间</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value?.length ? (
                        field.value.map(date => 
                          date ? format(date, "yyyy-MM-dd") : "").join(" 至 ")
                      ) : (
                        <span>选择日期范围</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={field.value as any}
                    onSelect={field.onChange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </FormItem>
          )}
        />

        <div className="col-span-full flex justify-end">
          <Button type="submit">搜索</Button>
        </div>
      </form>
    </Form>
  )
}
