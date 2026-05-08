/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: "/admin/login", destination: "/", permanent: false },
    ];
  },
};
export default nextConfig;
