import { MetadataRoute } from "next";
import { readdirSync, existsSync } from "fs";
import { join } from "path";

const siteUrl = "https://chirayuarya.com";

const SKIP = new Set(["components", "api"]);

function getAppRoutes(): string[] {
  const appDir = join(process.cwd(), "app");
  const routes: string[] = ["/"];

  try {
    const entries = readdirSync(appDir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      if (entry.name.startsWith("_") || entry.name.startsWith("(")) continue;
      if (SKIP.has(entry.name)) continue;

      // Only include if a page.tsx or page.js actually exists in the folder
      const dir = join(appDir, entry.name);
      if (existsSync(join(dir, "page.tsx")) || existsSync(join(dir, "page.js"))) {
        routes.push(`/${entry.name}`);
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
    priority: route === "/" ? 1 : 0.8,
  }));
}
