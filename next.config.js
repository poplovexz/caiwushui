/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ]
  },
  // 允许外网访问
  experimental: {
    serverActions: {
      allowedOrigins: ['*'],
      allowedForwardedHosts: ['*'],
    },
  },
  // 禁用严格模式以避免开发时的双重渲染
  reactStrictMode: false,
  // 输出独立构建
  output: 'standalone',
}

module.exports = nextConfig
