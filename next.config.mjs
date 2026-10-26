/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GITHUB_PAGES === "true" || process.env.NODE_ENV === "production";
const repoName = "/study-tracker";

const nextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath: isGithubPages ? repoName : "",
  assetPrefix: isGithubPages ? `${repoName}/` : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
