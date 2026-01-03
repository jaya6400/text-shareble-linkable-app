import { prisma } from "@/lib/prisma";
import { nowMs } from "@/lib/time";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const paste = await prisma.paste.findUnique({
    where: { id },
  });

  if (!paste) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const now = nowMs(req);

  if (paste.expiresAt && paste.expiresAt.getTime() <= now) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (paste.maxViews !== null && paste.viewCount >= paste.maxViews) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updated = await prisma.paste.update({
    where: { id },
    data: { viewCount: { increment: 1 } },
  });

  return NextResponse.json({
    content: updated.content,
    remaining_views:
      updated.maxViews === null
        ? null
        : Math.max(updated.maxViews - updated.viewCount, 0),
    expires_at: updated.expiresAt?.toISOString() ?? null,
  });
}
