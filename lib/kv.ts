import { kv } from "@vercel/kv";

const memory = new Set<string>(); // fallback for local dev

export async function getApprovedSet(): Promise<Set<string>> {
  try {
    const arr = await kv.smembers<string>("approved:ids");
    return new Set(arr || []);
  } catch {
    return memory;
  }
}

export async function setApproved(id: string, approved: boolean) {
  try {
    if (approved) await kv.sadd("approved:ids", id);
    else await kv.srem("approved:ids", id);
  } catch {
    if (approved) memory.add(id); else memory.delete(id);
  }
}
