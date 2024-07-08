/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net; object-src 'none'; base-uri 'none';",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
