/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@vibe/digi',
    '@vibe/browser',
    '@vibe/generic',
    '@vibe/config',
    '@vibe/ui'
  ],
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000' }]
      }
    ]
  }
}

module.exports = nextConfig
