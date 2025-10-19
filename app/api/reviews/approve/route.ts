import { NextRequest, NextResponse } from "next/server";
import { setApproved } from "@/lib/kv";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.id || typeof body.approved !== "boolean") {
    return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
  }
  await setApproved(String(body.id), body.approved);
  return NextResponse.json({ ok: true });
}
