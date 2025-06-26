import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   eslint: {
    ignoreDuringBuilds: true, // Disable ESLint checks during builds
  },
  typescript: {
    ignoreBuildErrors: true, // Ignore TypeScript errors
  },
  images:{
    remotePatterns: [
      {
         
        hostname:'dependable-bobcat-645.convex.cloud',
        protocol:'https'
      
      }
    ]
  }
};

export default nextConfig;
