import { CrawlerSettings } from "@/components/settings/crawler-settings"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"

export default function CrawlerSettingsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <Heading
          title="爬虫配置"
          description="配置企业信息采集爬虫的运行参数。"
        />
      </div>
      <Separator />
      <CrawlerSettings />
    </div>
  )
}
