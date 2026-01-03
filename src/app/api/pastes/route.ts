import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";
import { z } from "zod";
import { NextResponse } from "next/server";

const schema = z.object({
  content: z.string().min(1),
  ttl_seconds: z.number().int().min(1).optional(),
  max_views: z.number().int().min(1).optional(),
});

export async function POST(req: Request) {
  let body;
  try {
    body = schema.parse(await req.json());
  } catch {
    return NextResponse.json(
      { error: "Invalid input" },
      { status: 400 }
    );
  }

  const id = nanoid(10);

  const expiresAt = body.ttl_seconds
    ? new Date(Date.now() + body.ttl_seconds * 1000)
    : null;

  await prisma.paste.create({
    data: {
      id,
      content: body.content,
      expiresAt,
      maxViews: body.max_views ?? null,
    },
  });

  return NextResponse.json({
    id,
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/p/${id}`,
  });
}
