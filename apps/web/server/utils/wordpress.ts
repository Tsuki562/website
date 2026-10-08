import { products } from "~~/shared/data/site";
import type { Product } from "~~/shared/types/content";

interface WordPressPage {
  id: number;
  slug: string;
  link: string;
  title?: { rendered?: string };
}

export async function getWordPressPages(): Promise<WordPressPage[] | null> {
  const config = useRuntimeConfig();
  const baseUrl = String(config.wordpressBaseUrl || "").replace(/\/$/, "");
  if (!baseUrl) return null;

  try {
    return await $fetch<WordPressPage[]>(`${baseUrl}/wp-json/wp/v2/pages?per_page=100&_fields=id,slug,link,title`);
  } catch {
    return null;
  }
}

export async function getProductsFromWordPress(): Promise<Product[]> {
  // The custom WordPress plugin will expose structured products in a later phase.
  // Keeping the fallback here makes the first local build useful without credentials.
  return products;
}
