import { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Save } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export const metadata: Metadata = {
  title: "系统配置",
  description: "管理系统基本配置和参数",
}

export default function SystemSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">系统配置</h3>
          <p className="text-sm text-muted-foreground">
            管理系统基本配置和参数设置
          </p>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">基本设置</TabsTrigger>
          <TabsTrigger value="backup">备份与恢复</TabsTrigger>
          <TabsTrigger value="notification">通知设置</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>基本信息</CardTitle>
              <CardDescription>
                设置系统的基本信息和显示参数
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="system-name">系统名称</Label>
                  <Input id="system-name" defaultValue="财务税收管理系统" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="system-version">系统版本</Label>
                  <Input id="system-version" defaultValue="1.0.0" readOnly />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email">管理员邮箱</Label>
                  <Input id="admin-email" type="email" placeholder="admin@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="support-phone">技术支持电话</Label>
                  <Input id="support-phone" placeholder="400-888-8888" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                保存设置
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>系统参数</CardTitle>
              <CardDescription>
                配置系统运行的关键参数
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="session-timeout">会话超时时间（分钟）</Label>
                  <Input id="session-timeout" type="number" defaultValue="30" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-upload-size">最大上传文件大小（MB）</Label>
                  <Input id="max-upload-size" type="number" defaultValue="10" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                保存参数
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="backup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>数据备份</CardTitle>
              <CardDescription>
                配置系统数据的自动备份策略
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="backup-frequency">备份频率</Label>
                  <Select defaultValue="daily">
                    <SelectTrigger id="backup-frequency">
                      <SelectValue placeholder="选择备份频率" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">每日</SelectItem>
                      <SelectItem value="weekly">每周</SelectItem>
                      <SelectItem value="monthly">每月</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="backup-retention">保留时间（天）</Label>
                  <Input id="backup-retention" type="number" defaultValue="30" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                保存设置
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notification" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>通知设置</CardTitle>
              <CardDescription>
                配置系统通知和提醒方式
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="email-notification" defaultChecked />
                  <Label htmlFor="email-notification">启用邮件通知</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="sms-notification" />
                  <Label htmlFor="sms-notification">启用短信通知</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="system-notification" defaultChecked />
                  <Label htmlFor="system-notification">启用系统内部通知</Label>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                保存设置
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
