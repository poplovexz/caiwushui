import { Redis } from 'ioredis'
import { config } from 'dotenv'

// 加载环境变量
config()

const redis = new Redis(process.env.REDIS_URL!)

async function testRedisConnection() {
  try {
    // 测试设置值
    await redis.set('test', 'Hello Redis!')
    console.log('Successfully set test key')

    // 测试获取值
    const value = await redis.get('test')
    console.log('Retrieved value:', value)

    // 测试删除值
    await redis.del('test')
    console.log('Successfully deleted test key')

    console.log('Redis connection test passed!')
  } catch (error) {
    console.error('Redis connection test failed:', error)
  } finally {
    // 关闭连接
    redis.disconnect()
  }
}

testRedisConnection()
