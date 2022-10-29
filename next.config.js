/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'platform-lookaside.fbsbx.com',
      'lh3.googleusercontent.com',
      'cdn.discordapp.com',
    ],
  },
};

module.exports = nextConfig;
