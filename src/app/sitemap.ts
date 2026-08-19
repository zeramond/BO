import type { MetadataRoute } from "next";

const siteUrl = "https://bobowlingom.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/reserve`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/cafe`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}
