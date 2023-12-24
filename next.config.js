/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "suitmedia.static-assets.id",
        port: "",
        pathname: "/storage/files/**",
      },
    ],
  },
};

module.exports = nextConfig;
