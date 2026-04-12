import { MetadataRoute } from "next";
import { readdirSync } from "fs";
import { join } from "path";

const siteUrl = "https://chirayuarya.com";

function getAppRoutes(): string[] {
  const appDir = join(process.cwd(), "app");
  const routes: string[] = ["/"];

  try {
    const entries = readdirSync(appDir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      // Skip Next.js internals and component folders
      if (entry.name.startsWith("_") || entry.name.startsWith("(")) continue;
      if (entry.name === "components" || entry.name === "api") continue;

      const pageFile = join(appDir, entry.name, "page.tsx");
      try {
        readdirSync(join(appDir, entry.name));
        routes.push(`/${entry.name}`);
      } catch {
        // folder exists but no page — skip
      }
    }
  } catch {
    // fallback: just root
  }

  return routes;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = getAppRoutes();

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
