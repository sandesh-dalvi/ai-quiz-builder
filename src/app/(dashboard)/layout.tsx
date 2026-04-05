import { DashboardShell } from "@/components/dashboard/dashboardShell";
import { QueryProvider } from "@/components/providers/query-provider";

import { currentUser } from "@clerk/nextjs/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  return (
    <QueryProvider>
      <DashboardShell firstName={user?.firstName ?? undefined}>
        {children}
      </DashboardShell>
    </QueryProvider>
  );
}
