// Returns the basePath configured in next.config.ts.
// Use this when constructing paths for <img src> or <a href> outside of Next.js Link/Image.
export function getBasePath(): string {
  return process.env.__NEXT_ROUTER_BASEPATH || "";
}
