"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { toast } from "sonner"

const crawlerSettingsSchema = z.object({
  interval: z.number().min(60).max(86400),
  concurrent: z.number().min(1).max(20),
  timeout: z.number().min(1000).max(60000),
  retryTimes: z.number().min(0).max(10),
  retryDelay: z.number().min(1000).max(30000),
  proxyEnabled: z.boolean(),
  proxyHost: z.string().optional(),
  proxyPort: z.number().min(1).max(65535).optional(),
  proxyUsername: z.string().optional(),
  proxyPassword: z.string().optional(),
  logLevel: z.enum(["error", "warn", "info", "debug"]),
})

export function CrawlerSettings() {
  const [isRunning, setIsRunning] = useState(false)

  const form = useForm<z.infer<typeof crawlerSettingsSchema>>({
    resolver: zodResolver(crawlerSettingsSchema),
    defaultValues: {
      interval: 3600,
      concurrent: 5,
      timeout: 30000,
      retryTimes: 3,
      retryDelay: 5000,
      proxyEnabled: false,
      logLevel: "info",
    },
  })

  async function onSubmit(values: z.infer<typeof crawlerSettingsSchema>) {
    try {
      const response = await fetch("/api/settings/crawler", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error("保存配置失败")
      }

      toast.success("爬虫配置已更新")
    } catch (error) {
      console.error("保存爬虫配置失败:", error)
      toast.error("保存配置失败")
    }
  }

  const handleStartStop = async () => {
    try {
      const response = await fetch("/api/crawler/control", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: isRunning ? "stop" : "start" }),
      })

      if (!response.ok) {
        throw new Error("操作失败")
      }

      setIsRunning(!isRunning)
      toast.success(isRunning ? "爬虫已停止" : "爬虫已启动")
    } catch (error) {
      console.error("爬虫控制失败:", error)
      toast.error("操作失败")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">爬虫状态</h3>
          <p className="text-sm text-muted-foreground">
            控制爬虫的运行状态
          </p>
        </div>
        <Button
          variant={isRunning ? "destructive" : "default"}
          onClick={handleStartStop}
        >
          {isRunning ? "停止爬虫" : "启动爬虫"}
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>基本配置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="interval"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>运行间隔（秒）</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      两次爬取任务之间的间隔时间
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="concurrent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>并发数量</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      同时进行的爬取任务数量
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="timeout"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>超时时间（毫秒）</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      单个请求的超时时间
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>重试配置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="retryTimes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>重试次数</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      请求失败后的重试次数
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="retryDelay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>重试延迟（毫秒）</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      两次重试之间的等待时间
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>代理配置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="proxyEnabled"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <div>
                      <FormLabel>启用代理</FormLabel>
                      <FormDescription>
                        是否使用代理服务器
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch("proxyEnabled") && (
                <>
                  <FormField
                    control={form.control}
                    name="proxyHost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>代理主机</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="proxyPort"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>代理端口</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="proxyUsername"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>代理用户名</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="proxyPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>代理密码</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>日志配置</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="logLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>日志级别</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="选择日志级别" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="error">错误</SelectItem>
                        <SelectItem value="warn">警告</SelectItem>
                        <SelectItem value="info">信息</SelectItem>
                        <SelectItem value="debug">调试</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      控制日志记录的详细程度
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Button type="submit">保存配置</Button>
        </form>
      </Form>
    </div>
  )
}
