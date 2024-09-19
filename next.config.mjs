/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,  // This will disable ESLint during builds
    },
    trailingSlash: true,  // Optional, can help with routing on Netlify
    basePath: '',  // Optional, adjust if needed for subfolder hosting
    experimental: {
        missingSuspenseWithCSRBailout: false  // Disable CSR bailout for missing Suspense boundaries
    }
};

export default nextConfig;
