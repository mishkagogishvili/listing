/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,  // This will disable ESLint during builds
    },
    trailingSlash: true,  // Optional, can help with routing on Netlify
    basePath: '',  // Optional, adjust if needed for subfolder hosting
};

export default nextConfig;