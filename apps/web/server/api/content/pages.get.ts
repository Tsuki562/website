import { getWordPressPages } from "../../utils/wordpress";

export default defineEventHandler(async () => ({
  source: useRuntimeConfig().wordpressBaseUrl ? "wordpress" : "empty",
  pages: (await getWordPressPages()) ?? []
}));
