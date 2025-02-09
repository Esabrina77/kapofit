const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `frame-ancestors 'self' kaporelo.com *.kaporelo.com;`
          }
        ]
      }
    ]
  }
} 