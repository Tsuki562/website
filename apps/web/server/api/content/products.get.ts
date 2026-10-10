import { getProductsContent } from "../../utils/wordpress";

export default defineEventHandler(async () => {
  const result = await getProductsContent();
  return { source: result.source, products: result.items };
});
