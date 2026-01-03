import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function PastePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const paste = await prisma.paste.findUnique({
    where: { id },
  });

  if (!paste) notFound();

  if (paste.expiresAt && paste.expiresAt < new Date()) notFound();

  if (paste.maxViews !== null && paste.viewCount >= paste.maxViews) {
    notFound();
  }

  await prisma.paste.update({
    where: { id },
    data: { viewCount: { increment: 1 } },
  });

  return (
    <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
      {paste.content}
    </pre>
  );
}
