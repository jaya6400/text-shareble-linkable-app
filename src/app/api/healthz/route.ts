import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await prisma.paste.count();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("healthz error:", err);
    // Add detailed error info
    return NextResponse.json({ 
      ok: false, 
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined
    }, { status: 500 });
  }
}