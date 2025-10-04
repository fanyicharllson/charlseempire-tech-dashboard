import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'res.cloudinary.com', 
      'images.unsplash.com', 
      'via.placeholder.com' 
    ],
  },
};

export default nextConfig;
