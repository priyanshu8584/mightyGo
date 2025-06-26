import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
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
