import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const repoName = process.env.REPO_NAME || "";

const nextConfig: NextConfig = {
  output: "export",
  // GitHub Pages deploys to /<repo-name>/ subpath.
  // Set REPO_NAME env var in GitHub Actions, or leave empty for root deployment.
  basePath: isProd && repoName ? `/${repoName}` : "",
  assetPrefix: isProd && repoName ? `/${repoName}/` : "",
};

export default nextConfig;
