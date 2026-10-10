import { downloads as demoDownloads, products as demoProducts } from "~~/shared/data/site";
import type { Product } from "~~/shared/types/content";

export type ContentSource = "wordpress" | "demo" | "demo-fallback";

export interface ContentResult<T> {
  items: T[];
  source: ContentSource;
}

interface WordPressPage {
  id: number;
  slug: string;
  link: string;
  title?: { rendered?: string };
}

function restUrl(baseUrl: string, route: string, parameters: Record<string, string> = {}): string {
  const url = new URL(`${baseUrl}/`);
  // Query routing also works when Apache pretty-permalink rewrites are not enabled yet.
  url.searchParams.set("rest_route", route.startsWith("/") ? route : `/${route}`);
  for (const [key, value] of Object.entries(parameters)) url.searchParams.set(key, value);
  return url.toString();
}

export async function getWordPressPages(): Promise<WordPressPage[] | null> {
  const baseUrl = getWordPressBaseUrl();
  if (!baseUrl) return null;

  try {
    return await $fetch<WordPressPage[]>(restUrl(baseUrl, "/wp/v2/pages", {
      per_page: "100",
      _fields: "id,slug,link,title"
    }), { timeout: 5000 });
  } catch {
    return null;
  }
}

function getWordPressBaseUrl(): string {
  const config = useRuntimeConfig();
  return String(config.wordpressBaseUrl || "").replace(/\/$/, "");
}

async function getCollection<T>(path: string, fallback: T[]): Promise<ContentResult<T>> {
  const baseUrl = getWordPressBaseUrl();
  if (!baseUrl) return { items: fallback, source: "demo" };

  try {
    const items = await $fetch<T[]>(restUrl(baseUrl, `/cshk/v1/${path}`), { timeout: 5000 });
    if (!Array.isArray(items)) throw new TypeError(`WordPress ${path} response must be an array`);
    return { items, source: "wordpress" };
  } catch {
    return { items: fallback, source: "demo-fallback" };
  }
}

export function getProductsContent(): Promise<ContentResult<Product>> {
  return getCollection("products", demoProducts);
}

export function getDownloadsContent() {
  return getCollection("downloads", demoDownloads);
}
