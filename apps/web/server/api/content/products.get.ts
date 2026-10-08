import { getProductsFromWordPress } from "../../utils/wordpress";

export default defineEventHandler(async () => ({
  source: useRuntimeConfig().wordpressBaseUrl ? "wordpress-or-fallback" : "demo",
  products: await getProductsFromWordPress()
}));
