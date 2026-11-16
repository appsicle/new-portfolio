import "server-only";
import { get, put } from "@vercel/blob";

// Private Vercel Blob store (portfolio-stats). Needs BLOB_READ_WRITE_TOKEN.
export const TOKENS_PATH = "whoop/tokens.json";
export const STATS_PATH = "stats/latest.json";

export async function readJson<T>(pathname: string): Promise<T | null> {
  const res = await get(pathname, { access: "private", useCache: false });
  if (!res) return null;
  return (await new Response(res.stream).json()) as T;
}

export async function writeJson(pathname: string, data: unknown) {
  await put(pathname, JSON.stringify(data), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}
