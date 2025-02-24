"use client"

import { useQuery } from "@tanstack/react-query"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { formatDate, formatMoney } from "@/lib/utils"
import { EnterpriseStatus } from "@/types/enterprise"
import { DataTable } from "@/components/ui/data-table"
import { columns as branchColumns } from "./tables/branch-columns"
import { columns as shareholderColumns } from "./tables/shareholder-columns"
import { columns as investmentColumns } from "./tables/investment-columns"
import { columns as changeColumns } from "./tables/change-columns"
import { columns as annualReportColumns } from "./tables/annual-report-columns"

interface EnterpriseDetailProps {
  id: string
}

export function EnterpriseDetail({ id }: EnterpriseDetailProps) {
  const { data: enterprise, isLoading } = useQuery({
    queryKey: ["enterprise", id],
    queryFn: async () => {
      const response = await fetch(`/api/enterprises/${id}`)
      if (!response.ok) {
        throw new Error("获取企业详情失败")
      }
      return response.json()
    },
  })

  if (isLoading) {
    return <div>加载中...</div>
  }

  if (!enterprise) {
    return <div>未找到企业信息</div>
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>基本信息</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  企业名称
                </dt>
                <dd className="text-sm">{enterprise.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  统一社会信用代码
                </dt>
                <dd className="text-sm">{enterprise.unifiedSocialCode}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  法人代表
                </dt>
                <dd className="text-sm">{enterprise.legalPerson}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  注册资本
                </dt>
                <dd className="text-sm">
                  {formatMoney(enterprise.registeredCapital)}万元
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  实缴资本
                </dt>
                <dd className="text-sm">
                  {enterprise.paidInCapital
                    ? `${formatMoney(enterprise.paidInCapital)}万元`
                    : "-"}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>登记信息</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  经营状态
                </dt>
                <dd className="text-sm">
                  <span
                    className={
                      enterprise.status === EnterpriseStatus.NORMAL
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {enterprise.status}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  企业类型
                </dt>
                <dd className="text-sm">{enterprise.type}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  注册日期
                </dt>
                <dd className="text-sm">
                  {formatDate(enterprise.registrationDate)}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  登记机关
                </dt>
                <dd className="text-sm">{enterprise.registrationAuth}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  核准日期
                </dt>
                <dd className="text-sm">
                  {formatDate(enterprise.approvalDate)}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>联系方式</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  所属地区
                </dt>
                <dd className="text-sm">{enterprise.district}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  详细地址
                </dt>
                <dd className="text-sm">{enterprise.address}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  联系电话
                </dt>
                <dd className="text-sm">{enterprise.phone || "-"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  电子邮箱
                </dt>
                <dd className="text-sm">{enterprise.email || "-"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  官方网站
                </dt>
                <dd className="text-sm">
                  {enterprise.website ? (
                    <a
                      href={enterprise.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {enterprise.website}
                    </a>
                  ) : (
                    "-"
                  )}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>经营范围</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm whitespace-pre-wrap">
            {enterprise.businessScope}
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="branches" className="space-y-4">
        <TabsList>
          <TabsTrigger value="branches">分支机构</TabsTrigger>
          <TabsTrigger value="shareholders">股东信息</TabsTrigger>
          <TabsTrigger value="investments">对外投资</TabsTrigger>
          <TabsTrigger value="changes">工商变更</TabsTrigger>
          <TabsTrigger value="annual-reports">年报信息</TabsTrigger>
        </TabsList>
        <TabsContent value="branches">
          <Card>
            <CardHeader>
              <CardTitle>分支机构</CardTitle>
              <CardDescription>
                该企业的分支机构信息
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={branchColumns}
                data={enterprise.branches || []}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="shareholders">
          <Card>
            <CardHeader>
              <CardTitle>股东信息</CardTitle>
              <CardDescription>
                该企业的股东及出资信息
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={shareholderColumns}
                data={enterprise.shareholders || []}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="investments">
          <Card>
            <CardHeader>
              <CardTitle>对外投资</CardTitle>
              <CardDescription>
                该企业投资的其他企业信息
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={investmentColumns}
                data={enterprise.investments || []}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="changes">
          <Card>
            <CardHeader>
              <CardTitle>工商变更</CardTitle>
              <CardDescription>
                该企业的工商变更记录
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={changeColumns}
                data={enterprise.changes || []}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="annual-reports">
          <Card>
            <CardHeader>
              <CardTitle>年报信息</CardTitle>
              <CardDescription>
                该企业的年度报告信息
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={annualReportColumns}
                data={enterprise.annualReports || []}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
