import dotenv from "dotenv"
import path from "path"

// 加载环境变量
dotenv.config({ path: path.resolve(__dirname, "../../.env") })

export const config = {
  crawler: {
    interval: parseInt(process.env.CRAWLER_INTERVAL || "3600", 10),
    concurrent: parseInt(process.env.CRAWLER_CONCURRENT || "5", 10),
    timeout: parseInt(process.env.CRAWLER_TIMEOUT || "30000", 10),
    retryTimes: parseInt(process.env.CRAWLER_RETRY_TIMES || "3", 10),
    retryDelay: parseInt(process.env.CRAWLER_RETRY_DELAY || "5000", 10),
  },
  proxy: {
    enabled: process.env.PROXY_ENABLED === "true",
    host: process.env.PROXY_HOST || "127.0.0.1",
    port: parseInt(process.env.PROXY_PORT || "7890", 10),
    username: process.env.PROXY_USERNAME,
    password: process.env.PROXY_PASSWORD,
  },
  database: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432", 10),
    name: process.env.DB_NAME || "financeai_db",
    user: process.env.DB_USER || "financeai",
    password: process.env.DB_PASSWORD || "financeai123",
  },
  log: {
    level: process.env.LOG_LEVEL || "info",
    file: process.env.LOG_FILE || "crawler.log",
  },
  api: {
    key: process.env.API_KEY,
    secret: process.env.API_SECRET,
  },
}
