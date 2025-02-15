/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'lh3.googleusercontent.com',  // Pour les photos de profil Google
      'firebasestorage.googleapis.com'  // Pour Firebase Storage si on l'utilise plus tard
    ],
  },
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

module.exports = nextConfig 