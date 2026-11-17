import type { MetadataRoute } from "next";
import { PRODUTOS } from "@/data/produtos";
import { SITE } from "@/data/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE.url}/`, changeFrequency: "weekly", priority: 1 },
    ...PRODUTOS.map((produto) => ({
      url: `${SITE.url}/produto/${produto.id}/`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
