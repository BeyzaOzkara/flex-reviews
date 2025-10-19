import { kv } from "@vercel/kv";

const memory = new Set<string>(); // fallback for local dev or missing KV

export async function getApprovedSet(): Promise<Set<string>> {
  try {
    // `smembers` returns unknown[], so cast to string[]
    const arr = (await kv.smembers("approved:ids")) as string[];
    return new Set(arr ?? []);
  } catch {
    return memory;
  }
}

export async function setApproved(id: string, approved: boolean) {
  try {
    if (approved) {
      await kv.sadd("approved:ids", id);
    } else {
      await kv.srem("approved:ids", id);
    }
  } catch {
    // local fallback
    if (approved) memory.add(id);
    else memory.delete(id);
  }
}
