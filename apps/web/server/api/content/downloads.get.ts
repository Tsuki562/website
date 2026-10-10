import { getDownloadsContent } from "../../utils/wordpress";

export default defineEventHandler(async () => {
  const result = await getDownloadsContent();
  return { source: result.source, downloads: result.items };
});
