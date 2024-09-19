/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,  // This will disable ESLint during builds
    },
    output: 'export',
    trailingSlash: true,  // Ensure URLs have trailing slashes for Netlify compatibility
    basePath: '',  // Adjust if needed (optional)
};

export default nextConfig;