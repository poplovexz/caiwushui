"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { Button } from "../../components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form"
import { Input } from "../../components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select"
import { enterpriseSchema } from "../../lib/validations/enterprise"
import { toast } from "sonner"
import { z } from "zod"

type FormData = z.infer<typeof enterpriseSchema>

export function CreateEnterprise() {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(enterpriseSchema),
    defaultValues: {
      name: "",
      unifiedSocialCreditCode: "",
      registeredCapital: "",
      establishmentDate: "",
    },
  })

  async function onSubmit(data: FormData) {
    try {
      const response = await fetch("/api/enterprises", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("创建企业失败")
      }

      toast.success("创建企业成功")
      setOpen(false)
      form.reset()
      router.refresh()
    } catch (error) {
      toast.error("创建企业失败")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          添加企业
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>添加企业</DialogTitle>
          <DialogDescription>
            请填写企业基本信息，所有字段都是必填的。
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>企业名称</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="unifiedSocialCreditCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>统一社会信用代码</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="registeredCapital"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>注册资本（万元）</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="establishmentDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>成立日期</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                提交
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
