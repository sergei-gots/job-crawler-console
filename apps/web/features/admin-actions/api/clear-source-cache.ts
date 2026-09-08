import { postJson } from "@/shared/lib/api";

export async function clearSourceCache(sourceId: number, token: string): Promise<void> {
  await postJson<void>(`/sources/${sourceId}/clear-cache`, {}, token);
}
