import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "i.ytimg.com",
            },
            {
                protocol: "https",
                hostname: "pub-b07f842ba4ae41bc8cf97ca6adeff08b.r2.dev",
            },
        ],
    },
};

export default nextConfig;
