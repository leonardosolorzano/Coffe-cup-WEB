import type { NextConfig } from "next";
import { legacyRedirects } from "./lib/routes";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowLocalIP: process.env.NODE_ENV === "development",
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
    ],
  },
  // Los enlaces del navbar apuntaban a rutas que nunca existieron
  // (`/tienda`, `/loved-products`, `/category/...`). Se redireccionan para no
  // romper enlaces ya compartidos.
  async redirects() {
    return legacyRedirects;
  },
};

export default nextConfig;
