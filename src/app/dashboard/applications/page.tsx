import { prisma } from "@/lib/prisma";
import ApplicationsTabs from "@/components/dashboard/ApplicationsTabs";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ tab?: string }> };

export default async function ApplicationsPage({ searchParams }: Props) {
  const { tab } = await searchParams;
  const initialTab = tab === "received" ? "received" : "create";

  const applications = await prisma.application.findMany({
    orderBy: { createdAt: "desc" },
    include: { call: { select: { title: true } } },
  });

  const serialized = applications.map((a) => ({
    id: a.id,
    name: a.name,
    email: a.email,
    status: a.status,
    createdAt: a.createdAt.toISOString(),
    call: a.call,
  }));

  return <ApplicationsTabs applications={serialized} initialTab={initialTab} />;
}
